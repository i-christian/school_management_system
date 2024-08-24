import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { Dynamic } from "solid-js/web";
import Button from "./Button";
import { logo } from "../../assets/icons";
import HamBugerMenuIcon from "./HamBurger";
import NavUnOrderedList from "./NavUnOrderedList";
import { schoolName } from "../../context";
import { useAuth } from "../../context/UserContext";

const Nav: Component<{}> = () => {
  const [isFocused, setIsFocused] = createSignal<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  const buttonProps = () => {
    if (!isAuthenticated()) {
      return { name: "LogInButton", link: "/login", title: "Sign In" };
    } else if (user()?.is_superuser) {
      return { name: "Dashboard", link: "/admin", title: "Admin" };
    } else {
      return {
        name: "Dashboard",
        link: "/students",
        title: user()?.full_name || "Teacher",
      };
    }
  };

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
          <A href="/" class="max-w-fit mx-1">
            <h1 class="text-3xl p-3 max-sm:hidden min-[1060px]:hidden">{`${schoolName[0].name}`}</h1>
            <h1 class="text-3xl p-3 max-[1060px]:hidden">{`${schoolName[0].full}`}</h1>
            <h1 class="text-3xl p-3 sm:hidden">{`${schoolName[0].short}`}</h1>
          </A>
        </section>
        <NavUnOrderedList isFocused={isFocused} />
        <section class="flex justify-end items-center pr-4 gap-8">
          <Dynamic component={Button} {...buttonProps()} />
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
