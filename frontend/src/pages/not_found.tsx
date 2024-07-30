import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';

const NotFound: Component = () => {
  let navigate = useNavigate();
  return (
    <section class='flex flex-col gap-5'>
      <p class="text-center mt-40 text-3xl">Page Not Found</p>
      <button
        class="text-center btn mx-auto"
        onClick={() => navigate("/")}
      >
        Go back</button>
    </section>
  )
}

export default NotFound;
