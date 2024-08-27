import { Component, createSignal, Show } from 'solid-js';
import UserManagement from '../../components/admin/UserManagement';

const Admin: Component = () => {
  const [currentSection, setCurrentSection] = createSignal(localStorage.getItem('adminSection') || 'teachers');

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    localStorage.setItem('adminSection', section);
  };

  return (
    <main class="bg-inherit min-h-screen p-6">
      <h1 class='m-2 text-bold text-xl text-center'>Admin Dashboard</h1>
      <hr class="my-4" />
      <nav class="mb-6">
        <div class="flex justify-center space-x-4">
          <button
            aria-label="Manage Teachers"
            onClick={() => handleSectionChange('teachers')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'teachers' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Teachers
          </button>
          <button
            aria-label="Manage Subjects"
            onClick={() => handleSectionChange('subjects')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'subjects' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Subjects
          </button>
          <button
            aria-label="Manage Classes"
            onClick={() => handleSectionChange('classes')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'classes' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Classes
          </button>
          <button
            aria-label="Assignment Management"
            onClick={() => handleSectionChange('assignments')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'assignments' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Assign Teachers to Classes & Subjects
          </button>
          <button
            aria-label="Manage Students"
            onClick={() => handleSectionChange('students')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Students
          </button>
        </div>
      </nav>

      <div class="mt-4">
        <Show when={currentSection() === 'teachers'}>
          <UserManagement />
        </Show>
        <Show when={currentSection() === 'subjects'}>
          <p>Subject Management Section</p>
        </Show>
        <Show when={currentSection() === 'classes'}>
          <p>Class Management Section</p>
        </Show>
        <Show when={currentSection() === 'assignments'}>
          <p>Assignment Management Section</p>
        </Show>
        <Show when={currentSection() === 'students'}>
          <p>Student Management Section</p>
        </Show>
      </div>
    </main>
  );
};

export default Admin;
