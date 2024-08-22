import { createSignal } from "solid-js";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "@solidjs/router";

export const Login = () => {
  const { login, isLoading, error, resetError } = useAuth();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = async (event: Event) => {
    event.preventDefault();

    const loginData = {
      username: email(),
      password: password(),
    };

    resetError();

    try {
      await login(loginData);
      navigate("/admin");
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
                class="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                required
              />
            </div>

            <div class="w-full mt-4">
              <input
                class="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </div>

            {error() && (
              <div class="mt-4 text-red-600 dark:text-red-400 text-sm">
                {error()}
              </div>
            )}

            <div class="flex items-center justify-between mt-4">
              <a
                href="#"
                class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
              >
                Forgot Password?
              </a>

              <button
                type="submit"
                class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
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
