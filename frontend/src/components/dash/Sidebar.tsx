import { A } from "@solidjs/router";
import { Component, createSignal } from "solid-js";

const Sidebar: Component = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };

  return (
    <main class="bg-inherit">
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen() ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidenav"
      >
        <div class="overflow-y-auto py-10 px-3 h-full border-r border-gray-300 flex flex-col justify-between">
          <h1 class="text-2xl p-2">School Name</h1>
          <nav class="space-y-2 border bg-slate-400 dark:bg-slate-700 rounded-xl p-2 text-gray-50 my-10">
            <A
              href="/"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ml-3">Home</span>
            </A>
            <A
              href="/admin"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ml-3">Admin</span>
            </A>
            <A
              href="/users"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ml-3">Users</span>
            </A>
            <A
              href="/students"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ml-3">Students</span>
            </A>

          </nav>
          <A
            class="mx-10 bottom-0 left-0"
            href="/"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </A>
        </div>
      </aside>
    </main>
  );
};

export default Sidebar;
