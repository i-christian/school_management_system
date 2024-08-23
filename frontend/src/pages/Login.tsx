import { createStore } from "solid-js/store";
import { useAuth } from "../context/UserContext";

export const Login = () => {
  const { login, isLoading, error, resetError } = useAuth();

  const [formData, setFormData] = createStore({
    email: "",
    password: "",
    showPassword: false,
    emailError: "",
    passwordError: "",
  });

  const handleInputChange = (field: keyof typeof formData) => (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    setFormData({
      [field]: target.value,
      [`${field}Error`]: ""
    });
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let isValid = true;
    const newErrors: Partial<typeof formData> = {};

    if (!validateEmail(formData.email)) {
      newErrors.emailError = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.passwordError = "Password must be at least 8 characters long.";
      isValid = false;
    }

    setFormData(newErrors);
    return isValid;
  };

  const handleLogin = async (event: Event) => {
    event.preventDefault();

    if (!validateForm()) return;

    resetError();

    try {
      await login({ username: formData.email, password: formData.password });
    } catch (err) {
      console.error("Login error:", err);
      resetError();
    }
  };

  return (
    <section class="bg-inherit dark:text-white flex justify-center items-center min-h-screen">
      <div class="w-full max-w-sm mx-auto overflow-hidden bg-slate-300 rounded-lg shadow-md dark:bg-slate-800">
        <div class="px-6 py-4">
          <h3 class="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Welcome Back
          </h3>

          <p class="mt-1 text-center text-gray-500 dark:text-gray-400">
            Login to your account
          </p>

          <form onSubmit={handleLogin}>
            <div class="w-full mt-4">
              <input
                class="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={formData.email}
                onInput={handleInputChange("email")}
                required
              />
              {formData.emailError && (
                <div class="mt-2 text-red-600 dark:text-red-400 text-sm animate-bounce">
                  {formData.emailError}
                </div>
              )}
            </div>

            <div class="w-full mt-4 relative">
              <input
                class="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
                type={formData.showPassword ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                value={formData.password}
                onInput={handleInputChange("password")}
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-400 transition duration-300 ease-in-out group"
                onClick={() => setFormData("showPassword", !formData.showPassword)}
              >
                {formData.showPassword ? (
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
                <span class="tooltip-text group-hover:opacity-100 group-hover:visible opacity-0 invisible absolute right-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md transition-opacity duration-300">
                  {formData.showPassword ? "Hide Password" : "Show Password"}
                </span>
              </button>
            </div>

            {formData.passwordError && (
              <div class="mt-2 text-red-600 dark:text-red-400 text-sm animate-bounce">
                {formData.passwordError}
              </div>
            )}

            {error() && (
              <div class="mt-4 text-red-600 dark:text-red-400 text-sm animate-bounce">
                {error()}
              </div>
            )}

            <div class="flex items-center justify-between mt-4">
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500 transition duration-300 ease-in-out"
              >
                Forgot Password?
              </a>

              <button
                type="submit"
                class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 hover:scale-105 active:scale-95"
                disabled={isLoading()}
              >
                {isLoading() ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
