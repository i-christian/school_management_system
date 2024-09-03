import { createSignal, onCleanup } from "solid-js";
import { For } from "solid-js/web";

const HeroInfiniteLoop = () => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const items = [
    {
      src: "/src/assets/homeImages/library.png",
      context:
        "We have the best library to help our students achieve their goals in whatever way possible",
      title: "Library",
    },
    {
      src: "https://via.placeholder.com/320x240?text=2",
      context: "Context for Image 2",
    },
    {
      src: "https://via.placeholder.com/320x240?text=3",
      context: "Context for Image 3",
    },
  ]; // Replace with your image URLs and corresponding context
  const intervalTime = 900000; // 9 seconds

  // Function to cycle through items automatically
  const cycleItems = () => {
    setCurrentIndex((index) => (index + 1) % items.length);
  };

  // Set up the interval
  const interval = setInterval(cycleItems, intervalTime);

  // Clean up interval on component unmount
  onCleanup(() => clearInterval(interval));

  // Handle manual navigation
  const prevItem = () => {
    setCurrentIndex((index) => (index - 1 + items.length) % items.length);
  };

  const nextItem = () => {
    setCurrentIndex((index) => (index + 1) % items.length);
  };

  return (
    <div class="relative w-full max-w-lg h-60 sm:h-72 md:h-80 lg:h-96 xl:h-112 ">
      <For each={items}>
        {(item, index) => (
          <section>
            <div class="p-1">
              <h1 class="text-3xl">{item.title}</h1>
              <div
                class={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index() === currentIndex() ? "opacity-100" : "opacity-0"
                } flex items-start justify-center left-full`}
                style="background: transparent;"
              >
                <div class="flex-none w-full h-full flex justify-center ">
                  <img
                    src={item.src}
                    alt={`Slide ${index()}`}
                    class="ml-5 my-10 max-md:my-7  sm:w-40 sm:h-40 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-cover rounded-full max-sm:hidden items-center"
                  />
                  <div class="basis-2/4 flex-wrap pl-3 ">
                    <p class=" pt-10 md:my-5 max-sm:my-2 text-left text-lg">
                      {item.context}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </For>

      {/* Left Arrow */}
      <button
        class="absolute -left-7 max-md:left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 m-2 hover:bg-opacity-75 focus:outline-none"
        onClick={prevItem}
      >
        &#9664;
      </button>

      {/* Right Arrow */}
      <button
        class="absolute -right-10 max-md:right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 m-2 hover:bg-opacity-75 focus:outline-none"
        onClick={nextItem}
      >
        &#9654;
      </button>
    </div>
  );
};

export default HeroInfiniteLoop;
