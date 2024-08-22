import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Button: Component<{ name: string; link?: string; title: string }> = (props) => {
  const navigate = useNavigate();

  return (
    <button
      name={props.name}
      class="btn h-[15] w-20 py-1 px-1"
      onClick={() => props.link && navigate(props.link)} // Only navigate if link is provided
    >
      {props.title}
    </button>
  );
};

export default Button;

