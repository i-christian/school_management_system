import { Component, Match, Switch, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import Button from "./Button";
import { logo } from "../../assets/icons";
import HamBugerMenuIcon from "./HamBurger";
import NavUnOrderedList from "./NavUnOrderedList";
import { schoolName } from "../../context";
import { useAuth } from "../../context/UserContext";

const Nav: Component<{}> = () => {
  const [isFocused, setIsFocused] = createSignal<boolean>(false);
  const { isAuthenticated, user } = useAuth();

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
          <Switch fallback={<Button name="LogInButton" link="/login" title="Sign In" />}>
            <Match when={isAuthenticated() && user()?.is_superuser}>
              <Button name="Dashboard" link="/admin" title="Admin" />
            </Match>
            <Match when={isAuthenticated()}>
              <Button name="Dashboard" link={`/users/${user()?.id}`} title={user()?.full_name || 'Teacher'} />
            </Match>
          </Switch>
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
