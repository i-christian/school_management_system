import { Component, For, Switch, Match, createSignal, onMount } from "solid-js";
import { ReadUsersResponse, readUsers } from "../../client";
import { useAuth } from "../../context/UserContext";
import UserFormModal from "./UserFormModal";
import UserEditModal from "./UserEditModal";
import UserDeleteModal from "./UserDeleteModal";


const UserManagement: Component = () => {
  const [users, setUsers] = createSignal<ReadUsersResponse>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);
  const [editUserId, setEditUserId] = createSignal<string | null>(null);
  const [deleteUserId, setDeleteUserId] = createSignal<string | null>(null);
  const { user } = useAuth();

  const loadUsers = async () => {
    try {
      const response = await readUsers();
      setUsers(response);
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
    setEditUserId(null);
  };

  const handleUserDeleted = () => {
    loadUsers();
    setModalType(null);
    setDeleteUserId(null);
  };

  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">User Management</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
        <p class="text-md font-bold text-gray-600 dark:text-gray-300">Total Users: {users().count}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={users().data}>
          {(userItem) => (
            <div class="p-4 border rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-md">
              <div class="mb-2">
                <strong class={`text-lg ${userItem.id === user()?.id ? "text-blue-500 font-semibold" : "text-gray-800 dark:text-gray-100"}`}>
                  {userItem.id === user()?.id ? "You" : userItem.full_name || "Teacher"}
                </strong>
              </div>
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">Email:</strong> {userItem.email}
              </div>
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">Role:</strong> {userItem.is_superuser ? "Admin" : "Teacher"}
              </div>
              <div class="mb-2">
                <strong class="text-gray-800 dark:text-gray-100">Status:</strong> {userItem.is_active ? "Active" : "Inactive"}
              </div>
              <div class="flex items-center justify-end mt-4">
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
            </div>
          )}
        </For>
      </div>
      <Switch>
        <Match when={modalType() === "add"}>
          <UserFormModal
            onClose={() => setModalType(null)}
            onUserAdded={handleUserAdded}
          />
        </Match>
        <Match when={modalType() === "edit"}>
          {editUserId() && (
            <UserEditModal
              userId={editUserId()!}
              onClose={() => setModalType(null)}
              onUserUpdated={handleUserUpdated}
            />
          )}
        </Match>
        <Match when={modalType() === "delete"}>
          {deleteUserId() && (
            <UserDeleteModal
              userId={deleteUserId()!}
              onClose={() => setModalType(null)}
              onUserDeleted={handleUserDeleted}
            />
          )}
        </Match>
      </Switch>
    </section>
  );
};

export default UserManagement;
