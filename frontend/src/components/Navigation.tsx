import { Component } from "solid-js";
import { A } from "@solidjs/router";

const Navigation: Component = () => {
  return (
    <nav class="border my-2 flex flex-row p-2 justify-evenly mx-auto text-2xl bg-slate-950 text-blue-500 rounded-md">
      <A class="hover:bg-black px-4" href="/">Home</A>
      <A class="hover:bg-black px-4" href='/admin'>Admin</A>
      <A class="hover:bg-black px-4" href='/teachers'>Teachers</A>
      <A class="hover:bg-black px-4" href="/grades">Grades</A>
    </nav>
  )
}


export default Navigation;
