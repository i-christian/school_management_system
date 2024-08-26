import { Component, createSignal } from 'solid-js';
import { UpdatePassword, updatePasswordMe } from '../../client';

interface ChangePasswordProps {
  onUpdateSuccess: (message: string) => void;
}

const ChangePassword: Component<ChangePasswordProps> = (props) => {
  const [message, setMessage] = createSignal<string | null>(null);
  const [errors, setErrors] = createSignal<{ passwordError?: string; confirmPasswordError?: string }>({
    passwordError: '',
    confirmPasswordError: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

  const validatePassword = (newPassword: string, confirmPassword: string): boolean => {
    let isValid = true;
    const errorsObj: { passwordError?: string; confirmPasswordError?: string } = {};

    if (newPassword.length < 8) {
      errorsObj.passwordError = 'Password must be at least 8 characters long.';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      errorsObj.confirmPasswordError = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(errorsObj);
    return isValid;
  };

  const handlePasswordChange = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (validatePassword(newPassword, confirmPassword)) {
      try {
        const data: UpdatePassword = {
          current_password: currentPassword,
          new_password: newPassword,
        };

        const response = await updatePasswordMe({ requestBody: data });
        props.onUpdateSuccess(response.message);
        setMessage(response.message);
      } catch (error) {
        console.error('Error changing password:', error);
        setMessage('Failed to change password. Please try again.');
      }
    }
  };

  return (
    <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
      {message() && (
        <div class="mt-4 p-4 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-lg">
          {message()}
        </div>
      )}
      <form onSubmit={handlePasswordChange} class="mt-6 space-y-4">
        <div>
          <label for="currentPassword" class="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Current Password:
          </label>
          <div class="relative">
            <input
              type={showCurrentPassword() ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword())}
              aria-label="Toggle current password visibility"
            >
              {showCurrentPassword() ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm0 0v.001M12 3.75C8.486 3.75 5.368 5.767 3.75 8.25m15.5-4.5c-1.022 1.191-2.11 2.229-3.25 3.017m0 0c-2.474 1.765-5.49 2.733-8.75 2.733M12 3.75c3.24 0 6.276.947 8.75 2.733m-7.5 5.07v.001M21 12c-1.032 1.029-2.248 1.969-3.75 2.733m0 0c-2.608 1.07-5.56 1.734-8.25 1.734-2.71 0-5.217-.666-7.5-1.78M4.5 12a16.378 16.378 0 0 1 .25-2.5m0 0A16.56 16.56 0 0 1 8.25 7.5m0 0A16.447 16.447 0 0 1 12 6a16.447 16.447 0 0 1 3.75 1.5m3.75 4.5c-.251 1.065-.636 2.03-1.125 2.95m-2.25 0c-.49-.92-1.089-1.881-1.875-2.65" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75c-3.24 0-6.276.947-8.75 2.733M3.75 8.25C5.368 5.767 8.486 3.75 12 3.75c3.24 0 6.276.947 8.75 2.733m0 0A16.442 16.442 0 0 1 21 12c-1.07 1.366-2.2 2.608-3.25 3.75M12 6a16.447 16.447 0 0 1 3.75 1.5m-3.75 1.5a16.56 16.56 0 0 0-4.5 1.5m0 0c-1.246.79-2.45 1.705-3.5 2.65m0 0c1.32 1.12 2.805 2.077 4.5 2.733m4.5-6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <label for="newPassword" class="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            New Password:
          </label>
          <div class="relative">
            <input
              type={showNewPassword() ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword())}
              aria-label="Toggle new password visibility"
            >
              {showNewPassword() ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm0 0v.001M12 3.75C8.486 3.75 5.368 5.767 3.75 8.25m15.5-4.5c-1.022 1.191-2.11 2.229-3.25 3.017m0 0c-2.474 1.765-5.49 2.733-8.75 2.733M12 3.75c3.24 0 6.276.947 8.75 2.733m-7.5 5.07v.001M21 12c-1.032 1.029-2.248 1.969-3.75 2.733m0 0c-2.608 1.07-5.56 1.734-8.25 1.734-2.71 0-5.217-.666-7.5-1.78M4.5 12a16.378 16.378 0 0 1 .25-2.5m0 0A16.56 16.56 0 0 1 8.25 7.5m0 0A16.447 16.447 0 0 1 12 6a16.447 16.447 0 0 1 3.75 1.5m3.75 4.5c-.251 1.065-.636 2.03-1.125 2.95m-2.25 0c-.49-.92-1.089-1.881-1.875-2.65" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75c-3.24 0-6.276.947-8.75 2.733M3.75 8.25C5.368 5.767 8.486 3.75 12 3.75c3.24 0 6.276.947 8.75 2.733m0 0A16.442 16.442 0 0 1 21 12c-1.07 1.366-2.2 2.608-3.25 3.75M12 6a16.447 16.447 0 0 1 3.75 1.5m-3.75 1.5a16.56 16.56 0 0 0-4.5 1.5m0 0c-1.246.79-2.45 1.705-3.5 2.65m0 0c1.32 1.12 2.805 2.077 4.5 2.733m4.5-6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" />
                </svg>
              )}
            </button>
          </div>
          {errors().passwordError && (
            <p class="mt-2 text-red-500 dark:text-red-300">{errors().passwordError}</p>
          )}
        </div>
        <div>
          <label for="confirmPassword" class="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Confirm New Password:
          </label>
          <div class="relative">
            <input
              type={showConfirmPassword() ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword())}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword() ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm0 0v.001M12 3.75C8.486 3.75 5.368 5.767 3.75 8.25m15.5-4.5c-1.022 1.191-2.11 2.229-3.25 3.017m0 0c-2.474 1.765-5.49 2.733-8.75 2.733M12 3.75c3.24 0 6.276.947 8.75 2.733m-7.5 5.07v.001M21 12c-1.032 1.029-2.248 1.969-3.75 2.733m0 0c-2.608 1.07-5.56 1.734-8.25 1.734-2.71 0-5.217-.666-7.5-1.78M4.5 12a16.378 16.378 0 0 1 .25-2.5m0 0A16.56 16.56 0 0 1 8.25 7.5m0 0A16.447 16.447 0 0 1 12 6a16.447 16.447 0 0 1 3.75 1.5m3.75 4.5c-.251 1.065-.636 2.03-1.125 2.95m-2.25 0c-.49-.92-1.089-1.881-1.875-2.65" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75c-3.24 0-6.276.947-8.75 2.733M3.75 8.25C5.368 5.767 8.486 3.75 12 3.75c3.24 0 6.276.947 8.75 2.733m0 0A16.442 16.442 0 0 1 21 12c-1.07 1.366-2.2 2.608-3.25 3.75M12 6a16.447 16.447 0 0 1 3.75 1.5m-3.75 1.5a16.56 16.56 0 0 0-4.5 1.5m0 0c-1.246.79-2.45 1.705-3.5 2.65m0 0c1.32 1.12 2.805 2.077 4.5 2.733m4.5-6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" />
                </svg>
              )}
            </button>
          </div>
          {errors().confirmPasswordError && (
            <p class="mt-2 text-red-500 dark:text-red-300">{errors().confirmPasswordError}</p>
          )}
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Change Password
        </button>
      </form>
    </section>
  );
};

export default ChangePassword;
