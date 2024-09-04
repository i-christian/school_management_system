import { Component, createSignal, For } from 'solid-js';
import {
  readStudents,
  readSubjects,
  readGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  StudentPublic,
  SubjectPublic,
  GradePublic,
  GradeUpdate,
  GradeCreate
} from '../../client';

const GradesManagement: Component<{ onUpdateSuccess: (message: string) => void }> = (props) => {
  const [students, setStudents] = createSignal<StudentPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [grades, setGrades] = createSignal<Map<string, Map<string, GradePublic>>>(new Map());

  const fetchData = async () => {
    try {
      const studentResponse = await readStudents();
      const subjectResponse = await readSubjects();
      const gradeResponse = await readGrades();

      if (studentResponse && subjectResponse && gradeResponse) {
        setStudents(studentResponse.data);
        setSubjects(subjectResponse.data);

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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();

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
          currentGrades.set(subjectId, {
            student_id: studentId,
            subject_id: subjectId,
            score: numericGrade,
            id: currentGrades.get(subjectId)?.id || '' // Use existing ID or default to empty
          });
          updatedGrades.set(studentId, currentGrades);
        }
        return updatedGrades;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      for (const student of students()) {
        for (const subject of subjects()) {
          const grade = grades().get(student.id)?.get(subject.id);
          if (grade) {
            if (grade.id) {
              await updateGrade({
                id: grade.id,
                requestBody: {
                  student_id: student.id,
                  subject_id: subject.id,
                  score: grade.score
                } as GradeUpdate
              });
            } else {
              await createGrade({
                requestBody: {
                  student_id: student.id,
                  subject_id: subject.id,
                  score: grade.score
                } as GradeCreate
              });
            }
          }
        }
      }
      props.onUpdateSuccess('Grades updated successfully!');
    } catch (error) {
      console.error('Error saving grades:', error);
    }
  };

  const handleDeleteAllGrades = async () => {
    try {
      const gradesMap = grades();
      for (const studentGrades of gradesMap.values()) {
        for (const grade of studentGrades.values()) {
          await deleteGrade({ id: grade.id });
        }
      }
      // Clear the grades state after successful deletion
      setGrades(new Map());
      props.onUpdateSuccess('All grades deleted successfully!');
    } catch (error) {
      console.error('Error deleting all grades:', error);
    }
  };

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Grades</h2>
      <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
        <thead>
          <tr>
            <th class="px-4 py-2">Student</th>
            <For each={subjects()}>
              {(subject) => (
                <th class="px-4 py-2">{subject.name}</th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={students()}>
            {(student) => (
              <tr>
                <td class="px-4 py-2">{student.first_name} {student.last_name}</td>
                <For each={subjects()}>
                  {(subject) => (
                    <td class="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades().get(student.id)?.get(subject.id)?.score ?? ''}
                        onInput={(e) => handleGradeChange(student.id, subject.id, e.currentTarget.value)}
                        class="w-full p-1 border rounded"
                      />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Grades
      </button>
      <button
        onClick={handleDeleteAllGrades}
        class="mt-4 ml-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete All Grades
      </button>
    </div>
  );
};

export default GradesManagement;
