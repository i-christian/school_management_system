import { Component, onCleanup } from "solid-js";

const HamBugerMenuIcon: Component<{
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
}> = (props) => {
  const handleClick = () => {
    props.setIsFocused(!props.isFocused);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !event
        .composedPath()
        .includes(document.getElementById("hamburger-button")!)
    ) {
      props.setIsFocused(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  return (
    <div class="min-[780px]:hidden">
      <button
        id="hamburger-button"
        class="relative group"
        onClick={handleClick}
      >
        <div
          class={`relative flex overflow-hidden items-center justify-center w-[50px] h-[50px] transform transition-all bg-inherit hover:ring-1 ring-opacity-20 shadow-md`}
        >
          <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
            <div
              class={`bg-gray-900 dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${props.isFocused ? "translate-y-6" : ""
                } delay-100`}
            ></div>
            <div
              class={`bg-gray-900 dark:bg-white h-[2px] w-7 rounded transform transition-all duration-300 ${props.isFocused ? "translate-y-6" : ""
                } delay-75`}
            ></div>
            <div
              class={`bg-gray-900 dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${props.isFocused ? "translate-y-6" : ""
                }`}
            ></div>

            <div
              class={`absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 ${props.isFocused ? "translate-x-0 flex w-12" : "w-0"
                }`}
            >
              <div
                class={`absolute bg-gray-900 dark:bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 ${props.isFocused ? "rotate-45" : ""
                  }`}
              ></div>
              <div
                class={`absolute bg-gray-900 dark:bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 ${props.isFocused ? "-rotate-45" : ""
                  }`}
              ></div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default HamBugerMenuIcon;
