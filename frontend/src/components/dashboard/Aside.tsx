import { A } from "@solidjs/router";
import { Accessor, Component, For, Setter, createSignal } from "solid-js";
import { useAuth } from "../../context/UserContext";
import {
  admindashboardElements,
  userDashboardElements,
  logOutElement,
} from "../../context/index";
import Nav from "../home/Nav";

const Aside: Component<{
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
}> = () => {
  const { isAuthenticated, user } = useAuth();

  const [menus] = createSignal(
    isAuthenticated() && user()?.is_superuser
      ? admindashboardElements
      : userDashboardElements
  );

  console.log(menus());

  return (
    <>
      <header class="fixed top-0 left-0 w-full shadow-md z-50 bg-inherit backdrop-filter backdrop-blur-3xl backdrop-brightness-100 backdrop-contrast-100 px-5">
        <Nav navbarElements={menus()} />
      </header>
      <nav class="flex-grow flex flex-col gap-5 text-black dark:text-slate-100 fixed top-16 left-0">
        <For each={menus()}>
          {(menu, i) => (
            <A
              href={menu.link}
              class="group flex items-center gap-3.5 font-bold p-2 hover:bg-gray-300 rounded-lg"
            >
              <menu.icon />
              <span
                style={{ "transition-delay": `${i() * 100}ms` }}
                class="whitespace-pre duration-500"
              >
                {menu.name}
              </span>
            </A>
          )}
        </For>
        <section class="mt-auto text-2xl">
          <hr class="my-5" />
          <A
            href={logOutElement.link}
            class="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <logOutElement.icon />
            <span class="text-xl whitespace-pre duration-500">
              {logOutElement.name}
            </span>
          </A>
        </section>
      </nav>
      {/*<aside
      class={`bg-slate-500 dark:bg-slate-950 fixed left-0 top-0 shadow-3xl p-5 h-screen ${
        props.open() ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-500 text-gray-100 px-4 w-64 z-50 flex flex-col`}
    >
      <header class="flex justify-end lg:hidden">
        <button
          class="cursor-pointer"
          onClick={() => props.setOpen(!props.open())}
          aria-label="Close Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        </button>
      </header>
      <nav class="flex-grow flex flex-col mt-10 gap-5 text-black dark:text-slate-100">
        <For each={menus()}>
          {(menu, i) => (
            <A
              href={menu.link}
              class="group flex items-center gap-3.5 font-bold p-2 hover:bg-gray-300 rounded-lg"
            >
              <menu.icon />
              <span
                style={{ "transition-delay": `${i() * 100}ms` }}
                class="whitespace-pre duration-500"
              >
                {menu.name}
              </span>
            </A>
          )}
        </For>
        <section class="mt-auto text-2xl">
          <hr class="my-5" />
          <A
            href={logOutElement.link}
            class="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <logOutElement.icon />
            <span class="text-xl whitespace-pre duration-500">
              {logOutElement.name}
            </span>
          </A>
        </section>
      </nav>
    </aside>*/}
    </>
  );
};

export default Aside;
