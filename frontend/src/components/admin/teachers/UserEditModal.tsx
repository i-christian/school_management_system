import { Component, createSignal, onMount } from "solid-js";
import { updateUser, ReadUserByIdResponse, readUserById } from "../../../client";
import { useValidation } from "../../../hooks/useValidation";

interface UserEditModalProps {
  userId: string;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserEditModal: Component<UserEditModalProps> = (props) => {
  const [user, setUser] = createSignal<ReadUserByIdResponse | null>(null);
  const [emailOrPhone, setEmailOrPhone] = createSignal<string>("");
  const [fullName, setFullName] = createSignal<string | null>(null);
  const [password, setPassword] = createSignal<string | null>(null);
  const [showPassword, setShowPassword] = createSignal<boolean>(false);
  const [isActive, setIsActive] = createSignal<boolean>(true);
  const [isClassTeacher, setIsClassTeacher] = createSignal<boolean>(false);
  const [isAccountant, setIsAccountant] = createSignal<boolean>(false);
  const { errors, setErrors, validateEmailOrPhone } = useValidation();
  const [loading, setLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);

  const loadUser = async () => {
    try {
      const response = await readUserById({ userId: props.userId });
      setUser(response);
      setEmailOrPhone(response.email);
      setFullName(response.full_name || "");
      setIsActive(response.is_active as boolean);
      setIsClassTeacher(response.is_class_teacher as boolean);
      setIsAccountant(response.is_accountant as boolean); // Set is_accountant value
    } catch (err) {
      console.error("Failed to load user:", err);
      setError("Failed to load user data.");
    }
  };

  onMount(() => {
    loadUser();
  });

  const handleInputChange = (field: "emailOrPhone" | "password" | "fullName") => (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    if (field === "emailOrPhone") setEmailOrPhone(target.value);
    if (field === "password") setPassword(target.value);
    if (field === "fullName") setFullName(target.value);
    setErrors((prev) => ({ ...prev, [`${field}Error`]: "" }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setErrors((prev) => ({ ...prev, passwordError: "Password must be at least 8 characters long." }));
      return false;
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    if (!validateEmailOrPhone(emailOrPhone())) isValid = false;
    if (password() && !validatePassword(password()!)) isValid = false;
    return isValid;
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let username = emailOrPhone();
    if (/^0\d{9}$/.test(username)) {
      username = `${username}@email.com`;
    }

    if (user()) {
      try {
        await updateUser({
          userId: props.userId,
          requestBody: {
            email: username,
            full_name: fullName(),
            password: password() || undefined,
            is_active: isActive(),
            is_class_teacher: isClassTeacher(),
            is_accountant: isAccountant(),
          },
        });

        props.onUserUpdated();
        props.onClose();
      } catch (err) {
        console.error("Failed to update user:", err);
        setError("Failed to update user.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-gray-800">
        <h2 class="text-xl font-bold mb-4 text-gray-600 dark:text-gray-200">
          Edit User Information
          <br />
          <span class="text-sm font-normal text-gray-600 dark:text-gray-400">
            Leave any field unchanged to retain its current value.
          </span>
        </h2>

        <div class="mb-4">
          <label for="emailOrPhone" class="block text-gray-600 dark:text-gray-200">Email or Phone Number:</label>
          <input
            id="emailOrPhone"
            type="text"
            value={emailOrPhone()}
            onInput={handleInputChange("emailOrPhone")}
            class="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter email (e.g., example@example.com) or phone number (e.g., 0123456789)"
          />
          {errors().emailOrPhoneError && (
            <div class="mt-2 text-red-600 dark:text-red-400 text-sm">
              {errors().emailOrPhoneError}
            </div>
          )}
        </div>

        <div class="mb-4">
          <label for="fullName" class="block text-gray-600 dark:text-gray-200">Full Name:</label>
          <input
            id="fullName"
            type="text"
            value={fullName() || ""}
            onInput={handleInputChange("fullName")}
            class="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter full name"
          />
        </div>

        <div class="mb-4 relative">
          <input
            id="password"
            type={showPassword() ? "text" : "password"}
            value={password() || ""}
            onInput={handleInputChange("password")}
            class="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter new password (8+ characters)"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-400 transition duration-300 ease-in-out"
            onClick={() => setShowPassword(!showPassword())}
            aria-label={showPassword() ? "Hide password" : "Show password"}
          >
            {showPassword() ? (
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A5 5 0 0 1 5.823 10.8m-.634-1.638A9.88 9.88 0 0 1 12 4c4.572 0 8.573 3.043 10.568 7.27a9.88 9.88 0 0 1-2.206 2.848" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9a3 3 0 0 0-3 3m0 3a3 3 0 0 0 3-3m-3 0 1.5 1.5" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {errors().passwordError && (
            <div class="mt-2 text-red-600 dark:text-red-400 text-sm">
              {errors().passwordError}
            </div>
          )}
        </div>

        <div class="my-4 flex gap-2">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isActive">Active Status: </label>
          <p class="flex gap-1 items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive()}
              onChange={(e) => setIsActive(e.currentTarget.checked)}
              class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400"
            />
            <label class="text-gray-600 dark:text-gray-200" for="isActive">Is Active</label>
          </p>
        </div>

        <div class="my-4 flex gap-2">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isClassTeacher">Class Teacher Status: </label>
          <p class="flex gap-1 items-center">
            <input
              id="isClassTeacher"
              type="checkbox"
              checked={isClassTeacher()}
              onChange={(e) => setIsClassTeacher(e.currentTarget.checked)}
              class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400"
            />
            <label class="text-gray-600 dark:text-gray-200" for="isClassTeacher">Is Class Teacher</label>
          </p>
        </div>

        <div class="my-4 flex gap-2">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-200" for="isAccountant">Accountant Status: </label>
          <p class="flex gap-1 items-center">
            <input
              id="isAccountant"
              type="checkbox"
              checked={isAccountant()}
              onChange={(e) => setIsAccountant(e.currentTarget.checked)}
              class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400"
            />
            <label class="text-gray-600 dark:text-gray-200" for="isAccountant">Is Accountant</label>
          </p>
        </div>

        {error() && (
          <div class="mt-4 text-red-600 dark:text-red-400 text-sm">
            {error()}
          </div>
        )}

        <div class="flex justify-end gap-2 mt-6">
          <button
            onClick={props.onClose}
            class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={loading()}
          >
            {loading() ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
