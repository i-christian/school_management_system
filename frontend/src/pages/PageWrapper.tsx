import { createSignal, For, ParentComponent } from "solid-js";
import { A } from "@solidjs/router";

const PageWrapper: ParentComponent = (props) => {
  const menus = [
    { name: "Home", link: "/", icon: "M10 20v-6h4v6m-6 0H6a2 2 0 01-2-2v-6a2 2 0 012-2h2m6 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0v-6h4v6m6 0h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-6 0H6m-4 0H6a2 2 0 012-2V4a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 012 2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0h-2m6 0v-6h-4v6M6 4h2m4 0h-2v4h-4V4h2m-2 0h2m0 4v6m-6 0h-2v6a2 2 0 002 2h4v-6h-2m0 0h4v6h-4v-6m0 6h-2" },
    { name: "Admin", link: "/admin", icon: "M12 8V4m-8 8h16m-8 8v-4m0-8H4m8 8h8" },
    { name: "Users", link: "/users", icon: "M16 17a4 4 0 00-8 0m8 0v1a3 3 0 11-6 0v-1m6 0H8m-2 0H4v5a2 2 0 002 2h12a2 2 0 002-2v-5h-2m-4 0a3 3 0 11-6 0v-1m0 1h6" },
    { name: "Students", link: "/students", icon: "M12 6v12m6-6H6" },
    { name: "User Settings", link: "/settings", icon: "M12 15v2m-6-2v-2a3 3 0 013-3h6a3 3 0 013 3v2m-6 0H6m6 0h6m-6 4v-2m0 2h-6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-6z" },
  ];

  const [open, setOpen] = createSignal(false);

  return (
    <div class="flex">
      <aside
        class={`bg-slate-400 dark:bg-slate-900 fixed left-0 top-0 shadow-2xl p-5 h-screen ${open() ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-500 text-gray-100 px-4 w-64 z-50 flex flex-col`}
      >
        <header class="flex justify-end lg:hidden">
          <button
            class="cursor-pointer"
            onClick={() => setOpen(!open())}
            aria-label="Close Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
        </header>
        <nav class="flex-grow flex flex-col mt-10 gap-5">
          <For each={menus}>
            {(menu, i) => (
              <A
                href={menu.link}
                class="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d={menu.icon} />
                </svg>
                <span
                  style={{
                    "transition-delay": `${i() * 100}ms`,
                  }}
                  class="whitespace-pre duration-500"
                >
                  {menu.name}
                </span>
              </A>
            )}
          </For>
          <div class="mt-auto">
            <hr class="my-5" />
            <A
              href="/signout"
              class="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0012 1.5h-1.5v3H12a.75.75 0 01.75.75V9h3zm-9 9v-3h3v4.5H6A1.5 1.5 0 014.5 18v-6H7.5V9H4.5V4.5A1.5 1.5 0 016 3h3V1.5H6A3 3 0 003 4.5V18a3 3 0 003 3h3V18h-3z" />
              </svg>
              <span class="whitespace-pre duration-500">Sign Out</span>
            </A>
          </div>
        </nav>
      </aside>
      <main
        class="flex-grow transition-all duration-500 overflow-y-auto lg:ml-64"
      >
        <header class="flex justify-between mx-5 p-2 lg:hidden">
          <button
            class="cursor-pointer"
            onClick={() => setOpen(!open())}
            aria-label="Open Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <h1>School Name</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </header>
        <section class="bg-white w-full p-5">
          {props.children}
        </section>
      </main>
    </div>
  );
};

export default PageWrapper;
