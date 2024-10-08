import { Component, createSignal, Suspense, Show, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import MyClasses from '../../components/teachers/MyClasses';
import MyStudents from '../../components/teachers/MyStudents';
import TeachersAssignments from '../../components/teachers/TeachersAssignments';
import Spinner from '../../components/util/Spinner';


const Teachers: Component = () => {
  const [message, setMessage] = createSignal<string | null>(null);
  const [currentSection, setCurrentSection] = createSignal(localStorage.getItem('teacherSection') || 'classes');
  const [cachedComponents, setCachedComponents] = createSignal<Record<string, Component>>({});

  onMount(() => {
    cacheComponent(currentSection());
  });

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    localStorage.setItem('teacherSection', section);
    setMessage(null);

    if (!cachedComponents()[section]) {
      cacheComponent(section);
    }
  };

  const cacheComponent = (section: string) => {
    const componentMap: Record<string, Component> = {
      classes: MyClasses,
      assignments: TeachersAssignments,
    };

    if (section !== 'grades') {
      setCachedComponents((prev) => ({
        ...prev,
        [section]: componentMap[section],
      }));
    }
  };

  const currentComponent = () => cachedComponents()[currentSection()];

  return (
    <main class="bg-inherit min-h-screen p-6">
      <h1 class="m-2 text-bold text-xl text-center">Teacher's Dashboard</h1>
      <hr class="my-4" />
      <nav class="mb-6">
        <div class="flex justify-center space-x-4">
          <button
            aria-label="View Teachers and Assignments"
            aria-current={currentSection() === 'assignments' ? 'page' : undefined}
            onClick={() => handleSectionChange('assignments')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'assignments' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            Teachers and Classes
          </button>
          <button
            aria-label="View My Classes"
            aria-current={currentSection() === 'classes' ? 'page' : undefined}
            onClick={() => handleSectionChange('classes')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'classes' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            My Classes
          </button>
          <button
            aria-label="Manage Grades"
            aria-current={currentSection() === 'grades' ? 'page' : undefined}
            onClick={() => handleSectionChange('grades')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'grades' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            My Students
          </button>
        </div>
      </nav>

      <Show when={message()}>
        <div class="mb-4 p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-lg">
          {message()}
        </div>
      </Show>

      <div class="mt-4">
        <Suspense fallback={<Spinner />}>
          <Show when={currentSection() === 'grades'}>
            <MyStudents onUpdateMessage={setMessage} />
          </Show>
          <Show when={currentSection() !== 'grades'}>
            <Dynamic component={currentComponent()} />
          </Show>
        </Suspense>
      </div>
    </main>
  );
};

export default Teachers;
