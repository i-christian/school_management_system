import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import Button from "./Button";
import { logo } from "../../assets/icons";
import HamBugerMenuIcon from "./HamBurger";
import NavUnOrderedList from "./NavUnOrderedList";

const [isFocused, setIsFocused] = createSignal<boolean>(false);
const Nav: Component<{}> = () => {
  return (
    <nav class="flex flex-row justify-between items-center w-full h-16">
      <section class="flex flex-row justify-between items-center w-full">
        <section class="flex justify-start items-center gap-2">
          <A href="/">
            <img
              src={logo}
              alt="logo"
              height={40}
              width={40}
              class="rounded-full"
            />
          </A>
          <A href="/" class="max-w-fit mx-1 max-sm:hidden">
            <h1 class="text-3xl p-5">School Name</h1>
          </A>
        </section>
        <NavUnOrderedList isFocused={isFocused} />
        <section class="flex justify-end items-center pr-4 gap-8">
          <Button name="logInButton" title="Log in" link="/login" />
          <HamBugerMenuIcon
            isFocused={isFocused()}
            setIsFocused={setIsFocused}
          />
        </section>
      </section>
    </nav>
  );
};

export default Nav;
