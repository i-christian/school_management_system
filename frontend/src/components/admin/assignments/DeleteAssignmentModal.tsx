import { createSignal } from "solid-js";
import { deleteAssignment } from "../../../client";


const DeleteAssignmentModal = (props: {
  assignmentId: string;
  onClose: () => void;
  onAssignmentDeleted: () => void;
}) => {
  const [error, setError] = createSignal<string | null>(null);

  const handleDelete = async () => {
    try {
      setError(null);
      await deleteAssignment({ id: props.assignmentId });
      props.onAssignmentDeleted();
      props.onClose();
    } catch (err) {
      setError("Failed to delete assignment.");
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Delete Assignment</h2>
        <p class="mb-4">Are you sure you want to delete this assignment? This action cannot be undone.</p>

        {error() && <p class="text-red-600 mb-4">{error()}</p>}

        <div class="flex justify-end gap-4">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssignmentModal;
