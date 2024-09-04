import { Component, For, Show } from 'solid-js';
import { useGrades } from '../../hooks/useGrades';


const GradesManagement: Component<{ onUpdateMessage: (message: string) => void }> = (props) => {
  const { studentsByClass, subjects, grades, classForms, loading, handleGradeChange, handleSubmit, handleDeleteAllGrades } = useGrades(props.onUpdateMessage);

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Grades by Class</h2>
      <For each={classForms()}>
        {(classForm) => (
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4">{classForm.name}</h3>
            <Show when={studentsByClass().get(classForm.id)} fallback={<p>No students in this class</p>}>
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
                  <For each={studentsByClass().get(classForm.id)}>
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
            </Show>
          </div>
        )}
      </For>
      <button
        onClick={handleSubmit}
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading()}
      >
        {loading() ? 'Saving...' : 'Save Grades'}
      </button>
      <button
        onClick={handleDeleteAllGrades}
        class="mt-4 ml-4 px-4 py-2 bg-red-500 text-white rounded"
        disabled={loading()}
      >
        {loading() ? 'Deleting...' : 'Delete All Grades'}
      </button>
    </div>
  );
};

export default GradesManagement;
