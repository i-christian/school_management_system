import { Component } from "solid-js";
import { schoolName } from "../../context";

const Footer: Component = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-white dark:bg-slate-900" id="contact">
      <hr class="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />
      <div class="container p-6 mx-auto text-center">
        <h3 class="text-gray-800 uppercase dark:text-white">Contact</h3>
        <span class="block mt-2 text-sm text-gray-800 dark:text-gray-400 hover:underline">
          +265 886 8965
        </span>
        <span class="block mt-2 text-sm text-gray-800 dark:text-gray-400 hover:underline">
          example@email.com
        </span>

        <p class="mt-5 text-center text-gray-700 dark:text-gray-400">
          <span>
            <span class=" p-3 max-sm:hidden min-[1060px]:hidden">{`©${schoolName[0].name}`}</span>
            <span class=" p-3 max-[1060px]:hidden">{`©${schoolName[0].full}`}</span>
            <span class=" p-3 sm:hidden">{`©${schoolName[0].short}`}</span>
          </span>{" "}
          {currentYear} - All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
