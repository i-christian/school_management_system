import { Component, createSignal, onMount, Switch, Match, For } from "solid-js";
import { ReadClassFormsResponse, readClassForms } from "../../../client";
import ClassFormModal from "./ClassFormModal";
import ClassDeleteModal from "./ClassDeleteModal";

const ClassManagement: Component = () => {
  const [classForms, setClassForms] = createSignal<ReadClassFormsResponse>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);
  const [editClassId, setEditClassId] = createSignal<string>("");
  const [deleteClassId, setDeleteClassId] = createSignal<string>("");

  const loadClassForms = async () => {
    try {
      const response = await readClassForms();
      setClassForms(response);
    } catch (error) {
      console.error("Failed to load class forms:", error);
    }
  };

  onMount(() => {
    loadClassForms();
  });

  const handleClassAdded = () => {
    loadClassForms();
    setModalType(null);
  };

  const handleClassUpdated = () => {
    loadClassForms();
    setModalType(null);
    setEditClassId("");
  };

  const handleClassDeleted = () => {
    loadClassForms();
    setModalType(null);
    setDeleteClassId("");
  };

  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Class Management</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden lg:block">Add Class</span>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Switch>
          <Match when={classForms().data.length === 0}>
            <p class="text-center col-span-full">No classes available.</p>
          </Match>
          <Match when={classForms().data.length > 0}>
            <For each={classForms().data}>
              {(classForm) => (
                <div class="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                  <h3 class="text-lg font-bold mb-2">{classForm.name}</h3>
                  <div class="flex justify-between">
                    <button
                      class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      onClick={() => {
                        setEditClassId(classForm.id);
                        setModalType("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => {
                        setDeleteClassId(classForm.id);
                        setModalType("delete");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </For>
          </Match>
        </Switch>
      </div>

      <Switch>
        <Match when={modalType() === "add"}>
          <ClassFormModal onClose={() => setModalType(null)} onClassAdded={handleClassAdded} />
        </Match>
        <Match when={modalType() === "edit" && editClassId()}>
          <ClassFormModal
            classId={editClassId()}
            onClose={() => setModalType(null)}
            onClassUpdated={handleClassUpdated}
          />
        </Match>
        <Match when={modalType() === "delete" && deleteClassId()}>
          <ClassDeleteModal
            classId={deleteClassId()}
            onClose={() => setModalType(null)}
            onClassDeleted={handleClassDeleted}
          />
        </Match>
      </Switch>
    </section>
  );
};

export default ClassManagement;
