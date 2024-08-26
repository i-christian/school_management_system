import { Component, createSignal } from 'solid-js';
import { updateUserMe, UserUpdateMe } from '../../client';

const ProfileSettings: Component = () => {
  const [message, setMessage] = createSignal<string | null>(null);

  const handleProfileUpdate = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data: UserUpdateMe = {
      full_name: formData.get('fullName') as string,
    };

    try {
      await updateUserMe({ requestBody: data });
      setMessage('User updated successfully');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <section class="bg-inherit p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit Profile</h2>
      {message() && (
        <div class="mt-4 p-4 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-lg">
          {message()}
        </div>
      )}
      <form onSubmit={handleProfileUpdate} class="mt-6 space-y-4">
        <div>
          <label
            for="fullName"
            class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </section>
  );
};

export default ProfileSettings;
