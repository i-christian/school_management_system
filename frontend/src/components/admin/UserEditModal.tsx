import { Component, createSignal, onMount } from "solid-js";
import { updateUser, ReadUserByIdResponse, readUserById } from "../../client";

interface UserEditModalProps {
  userId: string;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserEditModal: Component<UserEditModalProps> = (props) => {
  const [user, setUser] = createSignal<ReadUserByIdResponse | null>(null);
  const [email, setEmail] = createSignal<string>("");
  const [fullName, setFullName] = createSignal<string | null>(null);
  const [password, setPassword] = createSignal<string | null>(null);

  const loadUser = async () => {
    try {
      const response = await readUserById({ userId: props.userId });
      setUser(response);
      setEmail(response.email);
      setFullName(response.full_name || "");
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  onMount(() => {
    loadUser();
  });

  const handleUpdate = async () => {
    if (user()) {
      try {
        await updateUser({
          userId: props.userId,
          requestBody: {
            email: email(),
            full_name: fullName(),
            password: password() || undefined,
          },
        });
        props.onUserUpdated();
        props.onClose();
      } catch (err) {
        console.error("Failed to update user:", err);
      }
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Edit User</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email:
            <input
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Full Name:
            <input
              type="text"
              value={fullName() || ""}
              onInput={(e) => setFullName(e.currentTarget.value)}
              class="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password (leave blank to keep current):
            <input
              type="password"
              value={password() || ""}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </label>
        </div>
        <div class="flex justify-end">
          <button onClick={handleUpdate} class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 mr-2">
            Save Changes
          </button>
          <button onClick={props.onClose} class="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
