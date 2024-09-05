import { Component, createMemo, createSignal, For, lazy, Show } from 'solid-js';
import { useGrades } from '../../hooks/useGrades';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';
import { useAuth } from '../../context/UserContext';
import { StudentPublic } from '../../client';
const ConfirmationModal = lazy(() => import('./ConfirmationModal'));



const GradesManagement: Component<{ onUpdateMessage: (message: string) => void }> = (props) => {
  const { studentsByClass, grades, loading, handleGradeChange, handleSubmitClassGrades, handleDeleteClassGrades, fetchData } = useGrades(props.onUpdateMessage);
  const { classes, subjects, assignments } = useFetchSchoolData();
  const { user } = useAuth();

  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const [selectedClass, setSelectedClass] = createSignal<string | null>(null);

  const filteredClasses = createMemo(() => {
    const subjectsMap = new Map(subjects().map((s) => [s.id, s.name]));
    const userAssignments = assignments().filter((assignment) => assignment.teacher_id === user()?.id);

    return classes()
      .map((classForm) => {
        const classSubjects = userAssignments
          .filter((assignment) => assignment.class_form_id === classForm.id)
          .map((assignment) => ({
            subjectId: assignment.subject_id,
            subjectName: subjectsMap.get(assignment.subject_id) || 'Unknown Subject',
          }));

        return {
          ...classForm,
          subjects: classSubjects,
        };
      })
      .filter((classItem) => classItem.subjects.length > 0);
  });

  const validateAndFormatGrade = (value: string): number => {
    const floatValue = parseFloat(value);
    return isNaN(floatValue) ? 0 : Math.max(0, Math.min(100, floatValue));
  };

  const sortStudentsBySurname = (students: StudentPublic[]) => {
    return [...students].sort((a, b) => a.last_name.localeCompare(b.last_name));
  };

  const handleSaveClick = (classFormId: string) => {
    setSelectedClass(classFormId);
    setShowSaveModal(true);
  };

  const handleDeleteClick = (classFormId: string) => {
    setSelectedClass(classFormId);
    setShowDeleteModal(true);
  };

  const confirmSave = async () => {
    if (selectedClass()) {
      await handleSubmitClassGrades(selectedClass()!);
      setShowSaveModal(false);
      fetchData();
    }
  };

  const confirmDelete = async () => {
    if (selectedClass()) {
      await handleDeleteClassGrades(selectedClass()!);
      setShowDeleteModal(false);
      fetchData();
    }
  };

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Grades by Class</h2>

      <For each={filteredClasses()}>
        {(classForm) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{classForm.name}</h3>
            <Show when={studentsByClass().get(classForm.id)} fallback={<p class="text-gray-500">No students in this class</p>}>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">#</th>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Student</th>
                      <For each={classForm.subjects}>
                        {(subject) => (
                          <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">{subject.subjectName}</th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={sortStudentsBySurname(studentsByClass().get(classForm.id) || [])}>
                      {(student, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">{index() + 1}</td>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {student.last_name} {student.middle_name ? `${student.middle_name} ` : ' '} {student.first_name}
                          </td>
                          <For each={classForm.subjects}>
                            {(subject) => {
                              const grade = grades().get(student.id)?.get(subject.subjectId);
                              return (
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={grade?.score ?? ''}
                                    onBlur={(e) => {
                                      const value = e.currentTarget.value;
                                      const formattedGrade = validateAndFormatGrade(value);
                                      handleGradeChange(student.id, subject.subjectId, formattedGrade.toString());
                                    }}
                                    class="w-full py-2 px-4 border border-gray-300 rounded-md text-center"
                                    placeholder="grade (%)"
                                  />
                                </td>
                              );
                            }}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
            <div class="mt-4 flex items-center space-x-4">
              <button
                onClick={() => handleSaveClick(classForm.id)}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Saving...' : `Save Grades for ${classForm.name}`}
              </button>
              <button
                onClick={() => handleDeleteClick(classForm.id)}
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Deleting...' : `Delete Grades for ${classForm.name}`}
              </button>
            </div>
          </div>
        )}
      </For>

      <Show when={showSaveModal()}>
        <ConfirmationModal
          title="Save Grades"
          message="Are you sure you want to save the grades for this class?"
          onConfirm={confirmSave}
          onCancel={() => setShowSaveModal(false)}
        />
      </Show>

      <Show when={showDeleteModal()}>
        <ConfirmationModal
          title="Delete Grades"
          message="Are you sure you want to delete all grades for this class?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </Show>
    </section>
  );
};

export default GradesManagement;
