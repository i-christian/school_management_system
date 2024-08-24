import { Component } from "solid-js";

const Admin: Component = () => {
  return (
    <main class="mx-auto flex flex-col">
      <section class="flex flex-col">
        <h2 class="text-bold py-2 text-md">User Manangement</h2>
        <button class="p-2 rounded-md w-fit bg-blue-500 hover:bg-blue-900">+ Add User </button>
        <p>List of users: Fullname, Email, Role, Status, Actions</p>
      </section>

      <section class="flex flex-row flex-wrap mt-10">
        <p> A card with academic year start/end, school hours
        </p>
        <p> OPTIONAL: A card with a graph on student performance</p>
      </section>

    </main>
  )
};

export default Admin;
