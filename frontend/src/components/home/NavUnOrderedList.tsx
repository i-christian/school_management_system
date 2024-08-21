import { A } from "@solidjs/router";
import { Component, For } from "solid-js";
import { navbarElements } from "../../context";

const NavUnOrderedList: Component<{ isFocused: () => boolean }> = (props) => {
  return (
    <>
      <ul class={`${props.isFocused() ? "sideBar" : "hidden"}`}>
        <For each={navbarElements}>
          {(element) => (
            <li class="flex flex-col gap-1 items-center justify-center mt-4">
              <div class="flex justify-center">
                <A
                  href={element.link}
                  class="flex flex-col justify-center items-center h-fit w-fit"
                >
                  <div class="flex justify-center items-center bg-slate-200 w-10 h-10 rounded-full">
                    <img
                      src={element.icon}
                      alt={element.title}
                      class="h-8 aspect-auto"
                    />
                  </div>
                  {element.title}
                </A>
              </div>
            </li>
          )}
        </For>
      </ul>
      <ul class={`navBarList`}>
        <For each={navbarElements}>
          {(element) => (
            <li>
              <A href={element.link}>{element.title}</A>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default NavUnOrderedList;
