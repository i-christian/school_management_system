import { Component, For, Switch, Match, createSignal, onMount } from "solid-js";
import { ReadUsersResponse, readUsers } from "../../../client";
import { useAuth } from "../../../context/UserContext";
import UserFormModal from "./UserFormModal";
import UserEditModal from "./UserEditModal";
import UserDeleteModal from "./UserDeleteModal";

const TeacherManagement: Component = () => {
  const [users, setUsers] = createSignal<ReadUsersResponse>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);
  const [editUserId, setEditUserId] = createSignal<string>("");
  const [deleteUserId, setDeleteUserId] = createSignal<string>("");
  const { user } = useAuth();

  const loadUsers = async () => {
    try {
      const response = await readUsers();
      setUsers({
        ...response,
        data: response.data.filter((userItem) => !userItem.is_superuser),
      });
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  onMount(() => {
    loadUsers();
  });

  const handleUserAdded = () => {
    loadUsers();
    setModalType(null);
  };

  const handleUserUpdated = () => {
    loadUsers();
    setModalType(null);
    setEditUserId("");
  };

  const handleUserDeleted = () => {
    loadUsers();
    setModalType(null);
    setDeleteUserId("");
  };

  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Teachers</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden lg:block">Add Users</span>
        </button>
        <p class="text-md font-bold text-gray-600 dark:text-gray-300">Number of Teachers: {users().count - 1}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">#</th>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={users().data}>
              {(userItem, index) => (
                <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{index() + 1}</td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <strong class={`text-lg ${userItem.id === user()?.id ? "text-blue-500 font-semibold" : "text-gray-800 dark:text-gray-100"}`}>
                      {userItem.id === user()?.id ? "You" : userItem.full_name || "Teacher"}
                    </strong>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{userItem.email}</td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{userItem.is_class_teacher ? "Class Teacher" : "Teacher"}</td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{userItem.is_active ? "Active" : "Inactive"}</td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        class={`p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 ${userItem.id === user()?.id ? "cursor-not-allowed" : ""}`}
                        disabled={userItem.id === user()?.id}
                        onClick={() => {
                          setEditUserId(userItem.id);
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
                          setDeleteUserId(userItem.id);
                          setModalType("delete");
                        }}
                        disabled={userItem.id === user()?.id}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Switch>
        <Match when={modalType() === "add"}>
          <UserFormModal
            onClose={() => setModalType(null)}
            onUserAdded={handleUserAdded}
          />
        </Match>
        <Match when={modalType() === "edit"}>
          <UserEditModal
            userId={editUserId()}
            onClose={() => setModalType(null)}
            onUserUpdated={handleUserUpdated}
          />
        </Match>
        <Match when={modalType() === "delete"}>
          <UserDeleteModal
            userId={deleteUserId()}
            onClose={() => setModalType(null)}
            onUserDeleted={handleUserDeleted}
          />
        </Match>
      </Switch>
    </section>
  );
};

export default TeacherManagement;
