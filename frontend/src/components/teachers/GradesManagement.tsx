import { Component, For, Show } from 'solid-js';
import { useGrades } from '../../hooks/useGrades';


const GradesManagement: Component<{ onUpdateMessage: (message: string) => void }> = (props) => {
  const { studentsByClass, subjects, grades, classForms, loading, handleGradeChange, handleSubmitClassGrades, handleDeleteClassGrades } = useGrades(props.onUpdateMessage);

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Grades by Class</h2>
      <For each={classForms()}>
        {(classForm) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{classForm.name}</h3>
            <Show when={studentsByClass().get(classForm.id)} fallback={<p class="text-gray-500">No students in this class</p>}>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Student</th>
                      <For each={subjects()}>
                        {(subject) => (
                          <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">{subject.name}</th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={studentsByClass().get(classForm.id)}>
                      {(student, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {student.first_name} {student.last_name}
                          </td>
                          <For each={subjects()}>
                            {(subject) => (
                              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={grades().get(student.id)?.get(subject.id)?.score ?? ''}
                                  onInput={(e) => handleGradeChange(student.id, subject.id, e.currentTarget.value)}
                                  class="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </td>
                            )}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
            <div class="mt-4">
              <button
                onClick={() => handleSubmitClassGrades(classForm.id)}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Saving...' : `Save Grades for ${classForm.name}`}
              </button>
              <button
                onClick={() => handleDeleteClassGrades(classForm.id)}
                class="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Deleting...' : `Delete Grades for ${classForm.name}`}
              </button>
            </div>
          </div>
        )}
      </For>
    </section>
  );
};

export default GradesManagement;
