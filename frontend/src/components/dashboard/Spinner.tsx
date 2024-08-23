import { Component } from "solid-js";

const Spinner: Component = () => {
  return (
    <div class="flex items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default Spinner;
