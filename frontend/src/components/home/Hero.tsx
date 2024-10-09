import { Component } from "solid-js";
import { schoolName } from "../../context";
import HeroInfiniteLoop from "./HeroInfiniteLoop";

const Hero: Component = () => {
  return (
    <section class="bg-[url('/src/assets/homeImages/library.png')] bg-cover bg-no-repeat relative z-10 w-full h-auto max-w-full">
      <div class=" bg-slate-300/90 dark:bg-slate-900/70 backdrop-blur-sm pt-20 px-4 mx-auto max-w-screen text-center lg:pt-28 lg:px-16 w-full pb-5">
        <h1 class="mb-4 text-2xl font-extrabold tracking-tight leading-none  md:text-3xl lg:text-4xl dark:text-white">
          Welcome to {`${schoolName[0].full}`}
        </h1>
        <p class="mb-10 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          A center of excellence for your child
        </p>
        <HeroInfiniteLoop />
      </div>
    </section>
  );
};

export default Hero;
