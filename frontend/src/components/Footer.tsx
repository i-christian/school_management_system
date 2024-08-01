import { Component } from 'solid-js';

const Footer: Component = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-white dark:bg-inherit" id="contact">
      <hr class="h-px my-6 bg-gray-200 border-none dark:bg-gray-700" />
      <div class="container p-6 mx-auto text-center">
        <h3 class="text-gray-700 uppercase dark:text-white">Contact</h3>
        <span class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">+265 886 8965</span>
        <span class="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">example@email.com</span>

        <p class="mt-5 text-center text-gray-500 dark:text-gray-400">© School Name {currentYear} - All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
