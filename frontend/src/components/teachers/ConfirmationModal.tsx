import { Component } from "solid-js";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}


const ConfirmationModal: Component<ConfirmationModalProps> = (props) => {
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-gray-800">
        <h2 class="text-xl font-bold mb-4 text-gray-600 dark:text-gray-200">{props.title}</h2>
        <p class="mb-4 text-gray-600 dark:text-gray-200">{props.message}</p>
        <div class="flex justify-end gap-2 mt-6">
          <button
            onClick={props.onCancel}
            class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={props.onConfirm}
            class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
