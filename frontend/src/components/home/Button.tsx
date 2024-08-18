import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Button: Component<{}> = ({ name, link, title }) => {
  const navigate = useNavigate();

  return (
    <button
      name={name}
      class="btn h-[15] w-20 py-1 px-1"
      onClick={() => navigate(link)}
    >
      {title}
    </button>
  );
};

export default Button;
