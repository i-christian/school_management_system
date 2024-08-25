import { Component, For, Switch, Match, createSignal, onMount } from "solid-js";
import { ReadUsersResponse, readUsers } from "../../client";
import UserFormModal from "../../components/admin/UserFormModal";
import UserEditModal from "../../components/admin/UserEditModal";
import { useAuth } from "../../context/UserContext";

const Admin: Component = () => {
  const [users, setUsers] = createSignal<ReadUsersResponse>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | null>(null);
  const [editUserId, setEditUserId] = createSignal<string | null>(null);
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

  return (
    <main class="mx-auto flex flex-col p-6 max-w-5xl bg-inherit min-h-screen">
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
                  <strong class="text-gray-800 dark:text-gray-100">Role:</strong> {userItem.is_superuser ? "Admin" : "User"}
                </div>
                <div class="mb-2">
                  <strong class="text-gray-800 dark:text-gray-100">Status:</strong> {userItem.is_active ? "Active" : "Inactive"}
                </div>
                <div class="flex items-center justify-end mt-4">
                  <button
                    class={`p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 ${userItem.id === user()?.id ? "cursor-not-allowed" : ""
                      }`}
                    disabled={userItem.id === user()?.id}
                    onClick={() => {
                      setEditUserId(userItem.id);
                      setModalType("edit");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 9a3.5 3.5 0 1 1-7 0M12 3.75V12M3 12h18M12 3v9m9 6h-4.5a1.5 1.5 0 1 1 0-3h4.5a1.5 1.5 0 1 1 0 3Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </section>

      <Switch fallback={null}>
        <Match when={modalType() === "edit"}>
          <UserEditModal
            userId={editUserId()!}
            onClose={() => setModalType(null)}
            onUserUpdated={handleUserUpdated}
          />
        </Match>
        <Match when={modalType() === "add"}>
          <UserFormModal
            onClose={() => setModalType(null)}
            onUserAdded={handleUserAdded}
          />
        </Match>
      </Switch>
    </main>
  );
};

export default Admin;
