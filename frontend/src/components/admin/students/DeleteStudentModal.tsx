import { Component, createSignal } from "solid-js";
import { deleteStudent } from "../../../client";

interface DeleteStudentModalProps {
  studentId: string;
  onClose: () => void;
  onStudentDeleted: () => void;
}

const DeleteStudentModal: Component<DeleteStudentModalProps> = (props) => {
  const [message, setMessage] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await deleteStudent({ id: props.studentId });
      setMessage("Student deleted successfully.");
      props.onStudentDeleted();
      setTimeout(() => props.onClose(), 300);
    } catch (error) {
      setMessage("Failed to delete student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-gray-800">
        <h2 class="text-xl font-bold mb-4 text-gray-600 dark:text-gray-200">Delete Student</h2>
        <p class="mb-4 text-gray-600 dark:text-gray-200">Are you sure you want to delete this student?</p>
        {message() && (
          <div class={`mt-4 ${message() === "Student deleted successfully." ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} text-sm`}>
            {message()}
          </div>
        )}
        <div class="flex justify-end gap-2 mt-6">
          <button
            onClick={props.onClose}
            class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={isLoading()}
          >
            {isLoading() ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentModal;
