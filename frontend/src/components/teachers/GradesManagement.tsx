import { Component, createSignal, For } from 'solid-js';

const GradesManagement: Component<{ onUpdateSuccess: (message: string) => void }> = (props) => {
  // Sample data representing students and their grades as percentages
  const initialStudents = [
    { id: 1, name: 'Maxy Maguire', grade: 95 },
    { id: 2, name: 'Precious Smith', grade: 88 },
    { id: 3, name: 'Honorifia Johnson', grade: 72 },
  ];

  const [students, setStudents] = createSignal(initialStudents);

  const handleGradeChange = (id: any, newGrade: string) => {
    const numericGrade = parseFloat(newGrade);
    if (!isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100) {
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? { ...student, grade: numericGrade } : student))
      );
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Logic to save grades to a backend or API would go here

    // Trigger success message
    props.onUpdateSuccess('Grades updated successfully!');
  };

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Grades Management</h2>
      <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
        <thead>
          <tr>
            <th class="py-3 px-6 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left">Student Name</th>
            <th class="py-3 px-6 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left">Grade (%)</th>
          </tr>
        </thead>
        <tbody>
          <For each={students()}>
            {(student, index) => (
              <tr class={`${index() % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}>
                <td class="py-3 px-6 border-b dark:border-gray-700">{student.name}</td>
                <td class="py-3 px-6 border-b dark:border-gray-700">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={student.grade}
                    onInput={(e) => handleGradeChange(student.id, e.currentTarget.value)}
                    class="border rounded-lg px-2 py-1 w-full dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="mt-6 text-right">
        <button
          onClick={handleSubmit}
          class="bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md"
        >
          Save Grades
        </button>
      </div>
    </div>
  );
};

export default GradesManagement;
