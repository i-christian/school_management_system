import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

export const Logout: Component = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement the logout logic here (e.g., clear session, API call)
    // After logout logic, redirect to login page or home page
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <section class="bg-inherit dark:text-white flex justify-center items-center min-h-screen">
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80">
          <div class="px-6 py-4">
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Confirm Logout</h4>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Are you sure you want to log out?</p>
          </div>
          <div class="flex justify-end p-4 space-x-2">
            <button
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              onClick={handleCancel}>
              Cancel
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
              onClick={handleLogout}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
