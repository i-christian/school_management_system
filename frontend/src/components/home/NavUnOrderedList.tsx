import { A } from "@solidjs/router";
import { Component, For } from "solid-js";
import { navbarElements } from "../../context";

const NavUnOrderedList: Component<{}> = (props) => {
  return (
    <>
      <ul class={`${props.isFocused() ? "sideBar" : "hidden"}`}>
        <For each={navbarElements}>
          {(element) => (
            <li>
              <A href={element.link}>{element.title}</A>
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
