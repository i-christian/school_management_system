import { Component, createSignal } from "solid-js";

export const Register: Component = () => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [phoneNumber, setPhoneNumber] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);

  const isValidPhoneNumber = () => {
    return /^0\d{9}$/.test(phoneNumber());
  };

  const isValidPassword = () => {
    return password().length >= 8;
  };

  const isValidConfirmPassword = () => {
    return confirmPassword() === password();
  };

  const isValidFirstName = () => {
    return firstName().length > 1;
  };

  const isValidLastName = () => {
    return lastName().length > 1;
  };

  const isValidForm = () => {
    return (
      isValidPhoneNumber() &&
      isValidPassword() &&
      isValidConfirmPassword() &&
      isValidFirstName() &&
      isValidLastName()
    );
  };

  return (
    <section class="bg-inherit grid rounded-xl">
      <div class="flex justify-center min-h-screen">
        <div class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div class="w-full">
            <form
              class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
              onSubmit={(event: any) => event.preventDefault()}
            >
              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={firstName()}
                  onInput={(event: any) => setFirstName(event.target.value)}
                  required
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Snow"
                  class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={lastName()}
                  onInput={(event: any) => setLastName(event.target.value)}
                  required
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Phone number
                </label>
                <input
                  type="text"
                  placeholder="XXX-XX-XXXX-XXX"
                  class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={phoneNumber()}
                  onInput={(event: any) => setPhoneNumber(event.target.value)}
                  required
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="johnsnow@example.com"
                  class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={email()}
                  onInput={(event: any) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Password
                </label>
                <div class="relative">
                  <input
                    type={showPassword() ? "text" : "password"}
                    placeholder="Enter your password"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    value={password()}
                    onInput={(event: any) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    class="absolute inset-y-0 right-0 px-4 text-gray-700 dark:text-gray-200"
                    type="button"
                    onClick={() => setShowPassword(!showPassword())}
                  >
                    {showPassword() ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Confirm password
                </label>
                <div class="relative">
                  <input
                    type={showPassword() ? "text" : "password"}
                    placeholder="Enter your password"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    value={confirmPassword()}
                    onInput={(event: any) =>
                      setConfirmPassword(event.target.value)
                    }
                    required
                  />
                  <div
                    class={`text-sm text-red-500 ${
                      confirmPassword() !== password() ? "visible" : "hidden"
                    }`}
                  >
                    Passwords do not match
                  </div>
                </div>
              </div>

              <button
                class={`flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
                  isValidForm() ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isValidForm()}
                type="submit"
              >
                <span>Sign Up </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 rtl:-scale-x-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
