import { Component, createSignal } from "solid-js";
import { CreateUserData, createUser } from "../../../client";
import { useValidation } from "../../../hooks/useValidation";

type UserFormModalProps = {
  onClose: () => void;
  onUserAdded: () => void;
};

const UserFormModal: Component<UserFormModalProps> = (props) => {
  const [emailOrPhone, setEmailOrPhone] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [fullName, setFullName] = createSignal("");
  const [isActive, setIsActive] = createSignal(true);
  const [isClassTeacher, setIsClassTeacher] = createSignal(false);
  const [isAccountant, setIsAccountant] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const { validateEmailOrPhone, validatePassword } = useValidation();

  const handleSubmit = async () => {
    if (!validateEmailOrPhone(emailOrPhone()) || !validatePassword(password(), confirmPassword())) return;

    let username = emailOrPhone();
    if (/^0\d{9}$/.test(username)) {
      username = `${username}@email.com`;
    }

    const newUser: CreateUserData = {
      requestBody: {
        email: username,
        password: password(),
        full_name: fullName(),
        is_active: isActive(),
        is_class_teacher: isClassTeacher(),
        is_superuser: false,
        is_accountant: isAccountant(),
      },
    };

    try {
      setLoading(true);
      await createUser(newUser);
      props.onUserAdded();
      props.onClose();
    } catch (error) {
      console.error("Failed to add user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="p-6 rounded shadow-md w-96 bg-slate-300 dark:bg-slate-800 relative">
        <h3 class="text-lg font-bold mb-4 text-gray-600 dark:text-gray-200">Add Users</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-200" for="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            class="border rounded p-2 w-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Full Name"
            value={fullName()}
            onInput={(e) => setFullName(e.currentTarget.value)}
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-200" for="emailOrPhone">Email or Phone</label>
          <input
            id="emailOrPhone"
            type="text"
            placeholder="Email or Phone"
            class="border rounded p-2 w-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-100"
            value={emailOrPhone()}
            onInput={(e) => setEmailOrPhone(e.currentTarget.value)}
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-200" for="password"></label>
          <div class="relative">
            <input
              id="password"
              type={showPassword() ? "text" : "password"}
              class="block w-full px-4 py-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 py-2 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-400 transition duration-300 ease-in-out"
              onClick={() => setShowPassword(!showPassword())}
              aria-label={showPassword() ? "Hide Password" : "Show Password"}
            >
              {showPassword() ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M13.875 18.825A5 5 0 0 1 5.823 10.8m-.634-1.638A9.88 9.88 0 0 1 12 4c4.572 0 8.573 3.043 10.568 7.27a9.88 9.88 0 0 1-2.206 2.848" />
                  <path d="M15 9a3 3 0 0 0-3 3m0 3a3 3 0 0 0 3-3m-3 0 1.5 1.5" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-200" for="confirmPassword"></label>
          <div class="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword() ? "text" : "password"}
              class="block w-full px-4 py-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 py-2 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-400 transition duration-300 ease-in-out"
              onClick={() => setShowConfirmPassword(!showConfirmPassword())}
              aria-label={showConfirmPassword() ? "Hide Confirm Password" : "Show Confirm Password"}
            >
              {showConfirmPassword() ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M13.875 18.825A5 5 0 0 1 5.823 10.8m-.634-1.638A9.88 9.88 0 0 1 12 4c4.572 0 8.573 3.043 10.568 7.27a9.88 9.88 0 0 1-2.206 2.848" />
                  <path d="M15 9a3 3 0 0 0-3 3m0 3a3 3 0 0 0 3-3m-3 0 1.5 1.5" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div class="my-4 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isActive">Active Status: </label>
            <div class="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive()}
                onChange={(e) => setIsActive(e.currentTarget.checked)}
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label class="text-gray-600 dark:text-gray-200" for="isActive">Is Active</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isClassTeacher">Class Teacher Status: </label>
            <div class="flex items-center gap-2">
              <input
                id="isClassTeacher"
                type="checkbox"
                checked={isClassTeacher()}
                onChange={(e) => setIsClassTeacher(e.currentTarget.checked)}
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label class="text-gray-600 dark:text-gray-200" for="isClassTeacher">Is Class Teacher</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isAccountant">Accountant Status: </label>
            <div class="flex items-center gap-2">
              <input
                id="isAccountant"
                type="checkbox"
                checked={isAccountant()}
                onChange={(e) => setIsAccountant(e.currentTarget.checked)}
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label class="text-gray-600 dark:text-gray-200" for="isAccountant">Is Accountant</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={props.onClose}
            disabled={loading()}
          >
            Cancel
          </button>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
            disabled={loading()}
          >
            {loading() ? "Adding..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
