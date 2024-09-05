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
  GradeCreate
} from '../client';

export const useGrades = (onUpdateMessage: (message: string) => void) => {
  const [students, setStudents] = createSignal<StudentPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [grades, setGrades] = createSignal<Map<string, Map<string, GradePublic>>>(new Map());
  const [classForms, setClassForms] = createSignal<ClassFormPublic[]>([]);
  const [studentsByClass, setStudentsByClass] = createSignal<Map<string, StudentPublic[]>>(new Map());
  const [loading, setLoading] = createSignal(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentResponse, subjectResponse, gradeResponse, classFormResponse] = await Promise.all([
        readStudents(),
        readSubjects(),
        readGrades(),
        readClassForms(),
      ]);

      if (studentResponse && subjectResponse && gradeResponse && classFormResponse) {
        setStudents(studentResponse.data);
        setSubjects(subjectResponse.data);
        setClassForms(classFormResponse.data);

        const existingGrades = new Map<string, Map<string, GradePublic>>();
        for (const grade of gradeResponse.data) {
          const studentId = grade.student_id;
          const subjectId = grade.subject_id;

          if (!existingGrades.has(studentId)) {
            existingGrades.set(studentId, new Map());
          }
          existingGrades.get(studentId)?.set(subjectId, grade);
        }
        setGrades(existingGrades);

        const studentsGroupedByClass = new Map<string, StudentPublic[]>();
        for (const student of studentResponse.data) {
          const formId = student.form_id;
          if (!studentsGroupedByClass.has(formId)) {
            studentsGroupedByClass.set(formId, []);
          }
          studentsGroupedByClass.get(formId)?.push(student);
        }
        setStudentsByClass(studentsGroupedByClass);
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
          const existingGrade = currentGrades.get(subjectId);
          const gradeToUpdate = existingGrade
            ? existingGrade
            : { student_id: studentId, subject_id: subjectId, score: numericGrade, id: '' };

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
