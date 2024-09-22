import { Component } from "solid-js";
import Nav from "./Nav";
import { navbarElements } from "../../context";

const Header: Component = () => {
  return (
    <>
      <header class="fixed top-0 left-0 w-full shadow-md z-50 bg-inherit backdrop-filter backdrop-blur-3xl backdrop-brightness-100 backdrop-contrast-100 px-5 flex justify-between items-center max-w-full">
        <Nav navbarElements={navbarElements} />
      </header>
    </>
  );
};

export default Header;
