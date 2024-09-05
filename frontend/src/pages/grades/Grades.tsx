import { Component, createSignal, Show, Suspense } from 'solid-js';
import ListGrades from '../../components/grades/ListGrades';
import CalculateGrades from '../../components/grades/CalculateGrades';
import Spinner from '../../components/util/Spinner';
// import { useAuth } from '../../context/UserContext';
// import { useNavigate } from '@solidjs/router';


const Grades: Component = () => {
  // const { isAuthenticated, user } = useAuth();
  // const navigate = useNavigate();

  // if (!isAuthenticated() || !(user()?.is_superuser || user()?.is_class_teacher)) {
  //   navigate("/403");
  //   return null;
  // }

  const [message, setMessage] = createSignal<string | null>(null);
  const [currentSection, setCurrentSection] = createSignal(localStorage.getItem('gradesSection') || 'list');

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    localStorage.setItem('gradesSection', section);
    setMessage(null);
  };

  return (
    <main class="bg-inherit min-h-screen p-6">
      <h1 class='m-2 text-bold text-xl text-center'>Grade's Dashboard</h1>
      <hr class="my-4" />
      <nav class="mb-6">
        <div class="flex justify-center space-x-4">
          <button
            aria-label="View Grades List"
            aria-current={currentSection() === 'list' ? 'page' : undefined}
            onClick={() => handleSectionChange('list')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            List Grades
          </button>
          <button
            aria-label="Calculate Grades"
            aria-current={currentSection() === 'calculate' ? 'page' : undefined}
            onClick={() => handleSectionChange('calculate')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentSection() === 'calculate' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            Calculate Grades
          </button>
        </div>
      </nav>

      <Show when={message()}>
        <div class="mb-4 p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-lg">
          {message()}
        </div>
      </Show>

      <div class="mt-4">
        <Show when={currentSection() === 'list'}>
          <Suspense fallback={<Spinner />}>
            <ListGrades />
          </Suspense>
        </Show>
        <Show when={currentSection() === 'calculate'}>
          <Suspense fallback={<Spinner />}>
            <CalculateGrades />
          </Suspense>
        </Show>
      </div>
    </main>
  );
};

export default Grades;
