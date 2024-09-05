import { Component, For } from 'solid-js';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';
import { useAuth } from '../../context/UserContext';

const MyClasses: Component = () => {
  const { classes, subjects, assignments, loading, error } = useFetchSchoolData();
  const { user } = useAuth();

  const filteredClasses = () => {
    const subjectsMap = new Map(subjects().map((s) => [s.id, s.name]));
    const userAssignments = assignments().filter((assignment) => assignment.teacher_id === user()?.id);

    return classes()
      .map((classForm) => {
        const classSubjects = userAssignments
          .filter((assignment) => assignment.class_form_id === classForm.id)
          .map((assignment) => subjectsMap.get(assignment.subject_id) || 'Unknown Subject');

        const sortedSubjects = classSubjects.sort((a, b) => a.localeCompare(b));

        return {
          className: classForm.name,
          subjects: sortedSubjects,
        };
      })
      .filter((classItem) => classItem.subjects.length > 0);
  };

  return (
    <div>
      <h2 class="text-lg font-bold mb-4">My Classes</h2>
      {loading() ? (
        <p>Loading classes...</p>
      ) : error() ? (
        <p class="text-red-500">{error()}</p>
      ) : filteredClasses().length === 0 ? (
        <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p class="text-gray-500 dark:text-gray-400">You currently have no classes assigned.</p>
          <p class="text-gray-500 dark:text-gray-400">Please check back later or contact the administration if you believe this is an error.</p>
        </div>
      ) : (
        <div class="space-y-4">
          <For each={filteredClasses()}>
            {(classItem) => (
              <div class="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md">
                <h3 class="text-md font-semibold mb-2">{classItem.className}</h3>
                <ol class="list-decimal list-inside pl-5 space-y-1">
                  <For each={classItem.subjects}>
                    {(subject) => (
                      <li class="text-gray-700 dark:text-gray-300">{subject}</li>
                    )}
                  </For>
                </ol>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default MyClasses;
