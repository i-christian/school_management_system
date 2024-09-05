import { Component } from 'solid-js';

const Spinner: Component = () => {
  return (
    <div class="flex items-center justify-center h-screen">
      <div class="w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
