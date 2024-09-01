import { Component } from "solid-js";
import { deleteClassForm } from "../../../client";

interface ClassDeleteModalProps {
  classId: string;
  onClose: () => void;
  onClassDeleted: () => void;
}

const ClassDeleteModal: Component<ClassDeleteModalProps> = (props) => {
  const handleDelete = async () => {
    try {
      await deleteClassForm({ id: props.classId });
      props.onClassDeleted();
      props.onClose();
    } catch (error) {
      console.error("Failed to delete class form:", error);
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Delete Class</h3>
        <p class="mb-4">Are you sure you want to delete this class?</p>
        <div class="flex justify-end">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDeleteModal;