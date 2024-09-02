import { Component, createSignal, Switch, Match, lazy } from 'solid-js';
import ClassManagement from '../../components/admin/classes/ClassManagement';
import SubjectManagement from '../../components/admin/subjects/SubjectManagement';
import AssignmentManagement from '../../components/admin/assignments/AssignmentManagement';

const Students: Component = lazy(() => import('../../components/admin/students/Students'));
const TeacherManagement: Component = lazy(() => import('../../components/admin/teachers/TeacherManagement'));

const Admin: Component = () => {
  const [currentSection, setCurrentSection] = createSignal(localStorage.getItem('adminSection') || 'teachers');
  const [cachedComponents, setCachedComponents] = createSignal(new Set<string>());

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    localStorage.setItem('adminSection', section);

    if (!cachedComponents().has(section)) {
      setCachedComponents((prev) => new Set(prev.add(section)));
    }
  };

  return (
    <main class="bg-inherit min-h-screen p-4 sm:p-6">
      <h1 class="m-2 text-bold text-lg sm:text-xl text-center">Admin Dashboard</h1>
      <hr class="my-4" />
      <nav class="mb-6">
        <div class="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            aria-label="Manage Teachers"
            onClick={() => handleSectionChange('teachers')}
            class={`py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'teachers' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Teachers
          </button>
          <button
            aria-label="Manage Students"
            onClick={() => handleSectionChange('students')}
            class={`py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Students
          </button>

          <button
            aria-label="Manage Subjects"
            onClick={() => handleSectionChange('subjects')}
            class={`py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'subjects' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Subjects
          </button>
          <button
            aria-label="Manage Classes"
            onClick={() => handleSectionChange('classes')}
            class={`py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'classes' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Manage Classes
          </button>
          <button
            aria-label="Assignment Management"
            onClick={() => handleSectionChange('assignments')}
            class={`py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'assignments' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Assign Teachers to Classes & Subjects
          </button>
        </div>
      </nav>

      <div class="mt-4">
        <Switch>
          <Match when={currentSection() === 'teachers'}>
            <TeacherManagement />
          </Match>
          <Match when={currentSection() === 'subjects' && cachedComponents().has('subjects')}>
            <SubjectManagement />
          </Match>
          <Match when={currentSection() === 'classes' && cachedComponents().has('classes')}>
            <ClassManagement />
          </Match>
          <Match when={currentSection() === 'assignments' && cachedComponents().has('assignments')}> <AssignmentManagement />
          </Match>
          <Match when={currentSection() === 'students' && cachedComponents().has('students')}>
            <Students />
          </Match>
        </Switch>
      </div>
    </main>
  );
};

export default Admin;
