import { Component, createSignal, onMount, Switch, Match, For } from "solid-js";
import { ReadSubjectsResponse, readSubjects } from "../../../client";
import SubjectFormModal from "./SubjectFormModal";
import SubjectDeleteModal from "./SubjectDeleteModal";

const SubjectManagement: Component = () => {
  const [subjects, setSubjects] = createSignal<ReadSubjectsResponse>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);
  const [editSubjectId, setEditSubjectId] = createSignal<string>("");
  const [deleteSubjectId, setDeleteSubjectId] = createSignal<string>("");

  const loadSubjects = async () => {
    try {
      const response = await readSubjects();
      setSubjects(response);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  onMount(() => {
    loadSubjects();
  });

  const handleSubjectAdded = () => {
    loadSubjects();
    setModalType(null);
  };

  const handleSubjectUpdated = () => {
    loadSubjects();
    setModalType(null);
    setEditSubjectId("");
  };

  const handleSubjectDeleted = () => {
    loadSubjects();
    setModalType(null);
    setDeleteSubjectId("");
  };

  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Subject Management</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden lg:block">Add Subject</span>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Switch>
          <Match when={subjects().data.length === 0}>
            <p class="text-center col-span-full">No subjects available.</p>
          </Match>
          <Match when={subjects().data.length > 0}>
            <For each={subjects().data}>
              {(subject) => (
                <div class="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                  <h3 class="text-lg font-bold mb-2">{subject.name}</h3>
                  <div class="flex justify-between">
                    <button
                      class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      onClick={() => {
                        setEditSubjectId(subject.id);
                        setModalType("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => {
                        setDeleteSubjectId(subject.id);
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
          <SubjectFormModal onClose={() => setModalType(null)} onSubjectAdded={handleSubjectAdded} />
        </Match>
        <Match when={modalType() === "edit" && editSubjectId()}>
          <SubjectFormModal
            subjectId={editSubjectId()}
            onClose={() => setModalType(null)}
            onSubjectUpdated={handleSubjectUpdated}
          />
        </Match>
        <Match when={modalType() === "delete" && deleteSubjectId()}>
          <SubjectDeleteModal
            subjectId={deleteSubjectId()}
            onClose={() => setModalType(null)}
            onSubjectDeleted={handleSubjectDeleted}
          />
        </Match>
      </Switch>
    </section>
  );
};

export default SubjectManagement;
