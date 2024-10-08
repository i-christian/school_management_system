import { Component, createSignal, onMount, Suspense } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import ProfileSettings from '../../components/settings/ProfileSettings';
import ChangePassword from '../../components/settings/ChangePassword';
import AppearanceSettings from '../../components/settings/AppearanceSettings';
import Spinner from '../../components/util/Spinner';


const UserSettings: Component = () => {
  const [message, setMessage] = createSignal<string | null>(null);
  const [currentSection, setCurrentSection] = createSignal(localStorage.getItem('settingsSection') || 'profile');
  const [cachedComponents, setCachedComponents] = createSignal<Record<string, Component>>({});

  onMount(() => {
    cacheComponent(currentSection());
  });

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    localStorage.setItem('settingsSection', section);
    setMessage(null);

    if (!cachedComponents()[section]) {
      cacheComponent(section);
    }
  };

  const cacheComponent = (section: string) => {
    const componentMap: Record<string, Component> = {
      profile: ProfileSettings,
      appearance: AppearanceSettings,
    };

    if (section !== 'password') {
      setCachedComponents((prev) => ({
        ...prev,
        [section]: componentMap[section],
      }));
    }
  };

  const currentComponent = () => cachedComponents()[currentSection()];

  return (
    <main class="bg-inherit min-h-screen p-6">
      <h1 class="m-2 text-bold text-xl text-center">Settings page</h1>
      <hr class="my-4" />
      <nav class="mb-6">
        <div class="flex justify-center space-x-4">
          <button
            onClick={() => handleSectionChange('profile')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors ${currentSection() === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleSectionChange('password')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors ${currentSection() === 'password' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            Change Password
          </button>
          <button
            onClick={() => handleSectionChange('appearance')}
            class={`py-2 px-4 rounded-lg font-medium transition-colors ${currentSection() === 'appearance' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
          >
            Appearance
          </button>
        </div>
      </nav>

      {message() && (
        <div class="mb-4 p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-lg">
          {message()}
        </div>
      )}

      <div class="mt-4">
        <Suspense fallback={<Spinner />}>
          {currentSection() === 'password' ? (
            <ChangePassword onUpdateSuccess={setMessage} />
          ) : (
            <Dynamic component={currentComponent()} />
          )}
        </Suspense>
      </div>
    </main>
  );
};

export default UserSettings;
