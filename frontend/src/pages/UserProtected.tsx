import { createSignal, ParentComponent } from "solid-js";
import Aside from "../components/dashboard/Aside";
import { useAuth } from "../context/UserContext";
import { A, useNavigate } from "@solidjs/router";
import { schoolName } from "../context";

const UserProtected: ParentComponent = (props) => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    const navigate = useNavigate();
    navigate("/login");
    return null;
  }

  return (
    <div class="flex justify-center">
      <Aside open={open} setOpen={setOpen} />
      <main class="flex-grow transition-all duration-500 overflow-y-auto lg:ml-64">
        <header class="flex justify-between mx-5 p-2">
          <button
            class="cursor-pointer lg:hidden"
            onClick={() => setOpen(!open())}
            aria-label="Open Sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
          </button>

          <h1 class="text-2xl">{schoolName[0].name}</h1>
          <A href="/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </A>

        </header>
        <section class="w-full p-5">{props.children}</section>
      </main>
    </div>
  );
};

export default UserProtected;
