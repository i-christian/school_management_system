import { createSignal } from 'solid-js';
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


export const useGrades = (onUpdateMessage: (message: string) => void) => {
  const [students, setStudents] = createSignal<StudentPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [grades, setGrades] = createSignal<Map<string, Map<string, GradePublic>>>(new Map());
  const [classForms, setClassForms] = createSignal<ClassFormPublic[]>([]);
  const [studentsByClass, setStudentsByClass] = createSignal<Map<string, StudentPublic[]>>(new Map());
  const [loading, setLoading] = createSignal(false);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentResponse, subjectResponse, gradeResponse, classFormResponse, assignmentResponse] = await Promise.all([
        readStudents(),
        readSubjects(),
        readGrades(),
        readClassForms(),
        readAssignments(),
      ]);

      if (studentResponse && subjectResponse && gradeResponse && classFormResponse && assignmentResponse) {
        setStudents(studentResponse.data);

        const currentUserId = user()?.id;
        if (currentUserId) {
          const teacherAssignments = assignmentResponse.data.filter(
            (assignment: AssignmentPublic) => assignment.teacher_id === currentUserId
          );

          const classIds = new Set<string>(teacherAssignments.map((assignment: AssignmentPublic) => assignment.class_form_id));
          const subjectIds = new Set<string>(teacherAssignments.map((assignment: AssignmentPublic) => assignment.subject_id));

          const filteredClassForms = classFormResponse.data.filter(
            (classForm: ClassFormPublic) => classIds.has(classForm.id)
          );
          setClassForms(filteredClassForms);

          const filteredSubjects = subjectResponse.data.filter(
            (subject: SubjectPublic) => subjectIds.has(subject.id)
          );
          setSubjects(filteredSubjects);

          const filteredGrades = new Map<string, Map<string, GradePublic>>();
          for (const grade of gradeResponse.data) {
            const studentId = grade.student_id;
            const subjectId = grade.subject_id;

            if (subjectIds.has(subjectId)) {
              if (!filteredGrades.has(studentId)) {
                filteredGrades.set(studentId, new Map());
              }
              filteredGrades.get(studentId)?.set(subjectId, grade);
            }
          }
          setGrades(filteredGrades);

          const studentsGroupedByClass = new Map<string, StudentPublic[]>();
          for (const student of studentResponse.data) {
            const formId = student.form_id;
            if (classIds.has(formId)) {
              if (!studentsGroupedByClass.has(formId)) {
                studentsGroupedByClass.set(formId, []);
              }
              studentsGroupedByClass.get(formId)?.push(student);
            }
          }
          setStudentsByClass(studentsGroupedByClass);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateGrade = async (studentId: string, subjectId: string, score: number, remark: string) => {
    try {
      const gradesMap = grades();
      const existingGrade = gradesMap.get(studentId)?.get(subjectId);

      const gradeData: GradeCreate | GradeUpdate = {
        student_id: studentId,
        subject_id: subjectId,
        score: score,
        remark: remark,
      };

      if (existingGrade) {
        await updateGrade({ id: existingGrade.id, requestBody: gradeData as GradeUpdate });
      } else {
        await createGrade({ requestBody: gradeData as GradeCreate });
      }

      await fetchData();
      onUpdateMessage('Grade updated successfully!');
    } catch (error) {
      console.error('Error creating/updating grade:', error);
    }
  };

  const handleSubmitClassGrades = async (classFormId: string) => {
    setLoading(true);
    try {
      const gradesMap = grades();
      const studentsInClass = studentsByClass().get(classFormId) || [];

      const promises = studentsInClass.flatMap(student =>
        subjects().map(subject => {
          const grade = gradesMap.get(student.id)?.get(subject.id);
          if (grade) {
            return createOrUpdateGrade(student.id, subject.id, grade.score, grade.remark ?? '');
          }
          return Promise.resolve();
        })
      );

      await Promise.all(promises);
      onUpdateMessage('Grades submitted successfully!');
    } catch (error) {
      console.error('Error submitting class grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassGrades = async (classFormId: string) => {
    setLoading(true);
    try {
      const gradesMap = grades();
      const studentsInClass = studentsByClass().get(classFormId) || [];
      const deletePromises = [];

      for (const student of studentsInClass) {
        const subjectGrades = gradesMap.get(student.id);
        if (subjectGrades) {
          for (const grade of subjectGrades.values()) {
            if (grade.id) {
              deletePromises.push(deleteGrade({ id: grade.id }));
            }
          }
        }
      }

      await Promise.all(deletePromises);

      setGrades((prevGrades) => {
        const updatedGrades = new Map(prevGrades);
        for (const student of studentsInClass) {
          updatedGrades.delete(student.id);
        }
        return updatedGrades;
      });

      onUpdateMessage('Grades deleted successfully!');
    } catch (error) {
      console.error('Error deleting class grades:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return {
    studentsByClass,
    subjects,
    students,
    grades,
    classForms,
    loading,
    fetchData,
    createOrUpdateGrade,
    handleSubmitClassGrades,
    handleDeleteClassGrades,
  };
};
