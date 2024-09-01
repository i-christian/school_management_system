import { Component, For, Switch, Match, createSignal, onMount } from "solid-js";
import { ReadStudentsResponse, readStudents } from "../../../client";


const Students: Component = () => {
  const [students, setStudents] = createSignal<ReadStudentsResponse>({ data: [], count: 0 })
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);


  const loadStudents = async () => {
    try {
      const response = await readStudents();
      setStudents({
        ...response
      });
      console.log(response)
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  onMount(() => {
    loadStudents();
  });


  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Students </h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
        <p class="text-md font-bold text-gray-600 dark:text-gray-300">Number of Students: {students().count}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={students().data}>
          {(studentItem) => (
            <div class="p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-md">
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">
                  {studentItem.form_id}
                </strong>
              </div>
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">Last Name:</strong> {studentItem.last_name}
              </div>
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">First Name:</strong> {studentItem.first_name}
              </div>
              <div class="flex items-center justify-end mt-4">
                <button
                  class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  onClick={() => {
                    setModalType("edit");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </button>
                <button
                  class="p-2 ml-2 rounded-md text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  onClick={() => {
                    setModalType("delete");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
      <Switch>
        <Match when={modalType() === "add"}>
          <p> Add students </p>
        </Match>
        <Match when={modalType() === "edit"}>
          <p> Edit student details </p>
        </Match>
        <Match when={modalType() === "delete"}>
          <p>Delete student </p>
        </Match>
      </Switch>
    </section >
  );
};

export default Students;
