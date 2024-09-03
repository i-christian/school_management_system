import { createSignal, onCleanup } from "solid-js";
import { For } from "solid-js/web";

const HeroInfiniteLoop = () => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const items = [
    {
      src: "/src/assets/homeImages/library.jpg",
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
  const intervalTime = 9000; // 9 seconds

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
    <div class="relative w-full max-w-screen h-60 sm:h-72 md:h-80 lg:h-96 xl:h-112">
      <For each={items}>
        {(item, index) => (
          <div
            class={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index() === currentIndex() ? "opacity-100" : "opacity-0"
            } flex items-center justify-center`}
          >
            <div class="flex flex-col items-center justify-center gap-4">
              <h1 class="text-2xl md:text-3xl lg:text-4xl">{item.title}</h1>
              <div class="flex flex-col md:flex-row items-center justify-center gap-4">
                <img
                  src={item.src}
                  alt={item.title}
                  class="rounded-full h-48 w-48 md:h-72 md:w-72 lg:h-96 lg:w-96 object-cover max-sm:hidden"
                />
                <p class="text-center md:text-left text-wrap w-48">
                  {item.context}
                </p>
              </div>
            </div>
          </div>
        )}
      </For>

      {/* Left Arrow */}
      <button
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
        onClick={prevItem}
      >
        &#9664;
      </button>

      {/* Right Arrow */}
      <button
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
        onClick={nextItem}
      >
        &#9654;
      </button>
    </div>
  );
};

export default HeroInfiniteLoop;
