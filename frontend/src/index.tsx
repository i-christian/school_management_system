import { render } from "solid-js/web";
import App from "./App.tsx";
import { OpenAPI } from "./client/index.ts";

OpenAPI.BASE = import.meta.env.VITE_API_URL
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}

render(
  App, document.getElementById("root")!
);
