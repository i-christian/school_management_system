import {
  readStudents,
  readSubjects,
  readGrades,
  readClassForms,
  createGrade,
  updateGrade,
  deleteGrade,
  StudentPublic,
  SubjectPublic,
  GradePublic,
  ClassFormPublic,
  GradeCreate,
  GradeUpdate,
  readAssignments,
  AssignmentPublic,
} from '../client';
import { useAuth } from '../context/UserContext';
import { createStore } from 'solid-js/store';


export const useGrades = (onUpdateMessage: (message: string) => void) => {
  const [state, setState] = createStore({
    students: [] as StudentPublic[],
    subjects: [] as SubjectPublic[],
    grades: new Map<string, Map<string, GradePublic>>(),
    classForms: [] as ClassFormPublic[],
    studentsByClass: new Map<string, StudentPublic[]>(),
    loading: false
  });

  const { user } = useAuth();

  const fetchData = async () => {
    setState("loading", true);
    try {
      const [studentResponse, subjectResponse, gradeResponse, classFormResponse, assignmentResponse] = await Promise.all([
        readStudents(),
        readSubjects(),
        readGrades(),
        readClassForms(),
        readAssignments(),
      ]);

      if (studentResponse && subjectResponse && gradeResponse && classFormResponse && assignmentResponse) {
        setState("students", studentResponse.data);

        const currentUserId: string | undefined = user()?.id;
        if (currentUserId) {
          const teacherAssignments: AssignmentPublic[] = assignmentResponse.data.filter(
            (assignment) => assignment.teacher_id === currentUserId
          );

          const classIds = new Set<string>(teacherAssignments.map(assignment => assignment.class_form_id));
          const subjectIds = new Set<string>(teacherAssignments.map(assignment => assignment.subject_id));

          setState("classForms", classFormResponse.data.filter(classForm => classIds.has(classForm.id)));
          setState("subjects", subjectResponse.data.filter(subject => subjectIds.has(subject.id)));

          const filteredGrades = new Map<string, Map<string, GradePublic>>();
          for (const grade of gradeResponse.data) {
            if (subjectIds.has(grade.subject_id)) {
              const studentGrades = filteredGrades.get(grade.student_id) || new Map<string, GradePublic>();
              studentGrades.set(grade.subject_id, grade);
              filteredGrades.set(grade.student_id, studentGrades);
            }
          }
          setState("grades", filteredGrades);

          const studentsGroupedByClass = new Map<string, StudentPublic[]>();
          studentResponse.data.forEach(student => {
            if (classIds.has(student.form_id)) {
              const group = studentsGroupedByClass.get(student.form_id) || [];
              group.push(student);
              studentsGroupedByClass.set(student.form_id, group);
            }
          });
          setState("studentsByClass", studentsGroupedByClass);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setState("loading", false);
    }
  };

  const createOrUpdateGrade = async (studentId: string, subjectId: string, score: number, remark: string) => {
    try {
      const existingGrade = state.grades.get(studentId)?.get(subjectId);
      const gradeData: GradeCreate | GradeUpdate = { student_id: studentId, subject_id: subjectId, score, remark };

      if (existingGrade) {
        await updateGrade({ id: existingGrade.id, requestBody: gradeData as GradeUpdate });
      } else {
        await createGrade({ requestBody: gradeData as GradeCreate });
      }

      await fetchData();
      onUpdateMessage('Grade updated successfully!');
    } catch (error) {
      onUpdateMessage('Failed to create/update grade');
    }
  };

  const handleSubmitClassGrades = async (classFormId: string) => {
    setState("loading", true);
    try {
      const studentsInClass = state.studentsByClass.get(classFormId) || [];
      await Promise.all(
        studentsInClass.flatMap(student =>
          state.subjects.map(subject => {
            const grade = state.grades.get(student.id)?.get(subject.id);
            if (grade) {
              return createOrUpdateGrade(student.id, subject.id, grade.score, grade.remark ?? '');
            }
            return Promise.resolve();
          })
        )
      );
      onUpdateMessage('Grades submitted successfully!');
    } catch (error) {
      onUpdateMessage('Grades submission failed, try again!');
    } finally {
      setState("loading", false);
    }
  };

  const handleDeleteClassGrades = async (classFormId: string) => {
    setState("loading", true);
    try {
      const studentsInClass = state.studentsByClass.get(classFormId) || [];

      for (const student of studentsInClass) {
        const studentGrades = state.grades.get(student.id);
        if (studentGrades) {
          for (const grade of studentGrades.values()) {
            if (grade.id) {
              await deleteGrade({ id: grade.id });
            }
          }
        }
      }

      await fetchData();
      onUpdateMessage('Grades deleted successfully!');
    } catch (error) {
      onUpdateMessage('Error deleting class grades, please try again.');
    } finally {
      setState("loading", false);
    }
  };

  fetchData();

  return {
    studentsByClass: () => state.studentsByClass,
    subjects: () => state.subjects,
    students: () => state.students,
    grades: () => state.grades,
    classForms: () => state.classForms,
    loading: () => state.loading,
    fetchData,
    createOrUpdateGrade,
    handleSubmitClassGrades,
    handleDeleteClassGrades,
  };
};
