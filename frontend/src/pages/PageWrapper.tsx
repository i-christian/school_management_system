import { createSignal, For, ParentComponent } from "solid-js";
import { A } from "@solidjs/router";

const PageWrapper: ParentComponent = (props) => {
  const menus = [
    {
      name: "Home", link: "/", icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    },
    { name: "Admin", link: "/admin", icon: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
    { name: "Users", link: "/users", icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" },
    { name: "Students", link: "/students", icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" },
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
          <div class="mt-auto text-2xl">
            <hr class="my-5" />
            <A
              href="/logout"
              class="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              <span class="text-xl whitespace-pre duration-500">Sign Out</span>
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
          <h1 class="text-2xl">School Name</h1>
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
