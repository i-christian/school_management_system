import { A } from "@solidjs/router";
import { Component, For } from "solid-js";

const NavUnOrderedList: Component<{
  isFocused: () => boolean;
  navbarElements: any;
}> = (props) => {
  return (
    <>
      <ul class={`${props.isFocused() ? "sideBar" : "hidden"}`}>
        <For each={props.navbarElements}>
          {(element) => (
            <li class="flex flex-col gap-1 items-center justify-center mt-4">
              <div class="flex justify-center">
                <A
                  href={element.link}
                  class="flex flex-col justify-center items-center h-fit w-fit"
                >
                  {element.icon}
                  {element.name}
                </A>
              </div>
            </li>
          )}
        </For>
      </ul>
      <ul class={`navBarList`}>
        <For each={props.navbarElements}>
          {(element) => (
            <li>
              <A href={element.link}>{element.name}</A>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default NavUnOrderedList;
