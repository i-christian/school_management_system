import { Component } from "solid-js";
import { schoolName } from "../../context";
import HeroInfiniteLoop from "./HeroInfiniteLoop";

const Hero: Component = () => {
  return (
    <section class="bg-[url('/src/assets/homeImages/library.png')] bg-cover bg-no-repeat relative z-10 w-full h-auto">
      <div class="bg-slate-300/90 dark:bg-slate-900/70 backdrop-blur-sm py-20 px-4 mx-auto max-w-screen-xl text-center lg:py-20 lg:px-16 w-full">
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none  md:text-5xl lg:text-6xl dark:text-white">
          Welcome to {`${schoolName[0].full}`}
        </h1>
        <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Your ultimate school management system that streamlines operations,
          enhances learning experiences, and connects all stakeholders in the
          educational ecosystem.
        </p>
        <HeroInfiniteLoop />
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get Started
            <svg
              class="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Learn More
          </a>
        </div>
        <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span class="font-semibold text-gray-400 uppercase">
            Trusted by Schools Worldwide
          </span>
          <div class="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            <a
              href="#"
              class="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
            >
              <svg
                class="h-8"
                viewBox="0 0 132 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG content */}
              </svg>
            </a>
            <a
              href="#"
              class="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
            >
              <svg
                class="h-11"
                viewBox="0 0 208 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG content */}
              </svg>
            </a>
            {/* Add more logos as needed */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
