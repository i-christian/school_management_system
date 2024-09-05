import { createSignal } from 'solid-js';
import {
  readStudents,
  readSubjects,
  readGrades,
  readClassForms,
  createGrade,
  deleteGrade,
  StudentPublic,
  SubjectPublic,
  GradePublic,
  ClassFormPublic,
  GradeCreate,
  readAssignments,
  AssignmentPublic
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
          const teacherAssignments = assignmentResponse.data.filter((assignment: AssignmentPublic) => assignment.teacher_id === currentUserId);

          const classIds = new Set<string>(teacherAssignments.map((assignment: AssignmentPublic) => assignment.class_form_id));
          const subjectIds = new Set<string>(teacherAssignments.map((assignment: AssignmentPublic) => assignment.subject_id));

          const filteredClassForms = classFormResponse.data.filter((classForm: ClassFormPublic) => classIds.has(classForm.id));
          setClassForms(filteredClassForms);

          const filteredSubjects = subjectResponse.data.filter((subject: SubjectPublic) => subjectIds.has(subject.id));
          setSubjects(filteredSubjects);

          const existingGrades = new Map<string, Map<string, GradePublic>>();
          for (const grade of gradeResponse.data) {
            const studentId = grade.student_id;
            const subjectId = grade.subject_id;

            if (subjectIds.has(subjectId)) {
              if (!existingGrades.has(studentId)) {
                existingGrades.set(studentId, new Map());
              }
              existingGrades.get(studentId)?.set(subjectId, grade);
            }
          }
          setGrades(existingGrades);

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

  const handleGradeChange = (studentId: string, subjectId: string, newGrade: string) => {
    const numericGrade = parseFloat(newGrade);
    if (!isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100) {
      setGrades((prevGrades) => {
        const updatedGrades = new Map(prevGrades);
        if (!updatedGrades.has(studentId)) {
          updatedGrades.set(studentId, new Map());
        }
        const currentGrades = updatedGrades.get(studentId);
        if (currentGrades) {
          const gradeToUpdate = currentGrades.get(subjectId) || { student_id: studentId, subject_id: subjectId, score: numericGrade, id: '' };
          gradeToUpdate.score = numericGrade;
          currentGrades.set(subjectId, gradeToUpdate);
          updatedGrades.set(studentId, currentGrades);
        }
        return updatedGrades;
      });
    }
  };

  const handleSubmitClassGrades = async (classFormId: string) => {
    setLoading(true);
    try {
      const gradesMap = grades();
      const promises = [];
      const studentsInClass = studentsByClass().get(classFormId) || [];

      for (const student of studentsInClass) {
        for (const subject of subjects()) {
          const grade = gradesMap.get(student.id)?.get(subject.id);
          if (grade) {
            promises.push(
              createGrade({
                requestBody: {
                  student_id: student.id,
                  subject_id: subject.id,
                  score: grade.score,
                } as GradeCreate,
              })
            );
          }
        }
      }

      await Promise.all(promises);
      onUpdateMessage(`Grades updated successfully!`);
    } catch (error) {
      console.error('Error saving grades:', error);
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
        const studentGrades = gradesMap.get(student.id);
        if (studentGrades) {
          for (const grade of studentGrades.values()) {
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

      onUpdateMessage(`Grades deleted successfully!`);
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
    handleGradeChange,
    handleSubmitClassGrades,
    handleDeleteClassGrades,
  };
};
