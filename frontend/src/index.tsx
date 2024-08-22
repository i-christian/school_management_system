import { render } from "solid-js/web";
import App from "./App.tsx";
import { OpenAPI } from "./client/index.ts";
import { AuthProvider } from "./context/UserContext.tsx";

OpenAPI.BASE = import.meta.env.VITE_API_URL
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}

render(
  () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
  document.getElementById("root") as HTMLElement
);
