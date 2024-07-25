import { type Component } from "solid-js";

const Home: Component = () => {
  return (
    <main class=" my-5 flex flex-row gap-5">
      <aside class="p-2 w-1/3 border h-full inset-y-0 left-0 ">
        Side bar
      </aside>
      <section class="flex-grow">main content</section>
    </main>
  )
}


export default Home;
