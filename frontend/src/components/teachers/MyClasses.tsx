import { Component, For } from 'solid-js';

const MyClasses: Component = () => {
  // mock data to be deleted once backend functionality is implemented
  const classes = [
    {
      className: 'Form 1A',
      subjects: ['Math', 'Science', 'English'],
    },
    {
      className: 'Form 2B',
      subjects: ['History', 'Geography'],
    },
    {
      className: 'Form 3A',
      subjects: ['Physics', 'Chemistry', 'Biology'],
    },
  ];

  return (
    <div>
      <h2 class="text-lg font-bold mb-4">My Classes</h2>
      <div class="space-y-4">
        <For each={classes}>
          {(classItem) => (
            <div class="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <h3 class="text-md font-semibold mb-2">{classItem.className}</h3>
              <ul class="list-disc list-inside">
                <For each={classItem.subjects}>
                  {(subject) => (
                    <li class="text-gray-700 dark:text-gray-300">{subject}</li>
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default MyClasses;
