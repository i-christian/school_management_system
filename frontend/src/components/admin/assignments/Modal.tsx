import { Component } from "solid-js";

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Modal: Component<ModalProps> = ({ title, message, onClose }) => {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="p-6 rounded shadow-md w-96 bg-slate-300 dark:bg-slate-800 relative">
        <h2 class="text-lg font-bold mb-4 text-gray-600 dark:text-gray-200">{title}</h2>
        <p class="text-gray-700 dark:text-gray-100">{message}</p>
        <div class="flex justify-end mt-4">
          <button
            onClick={onClose}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
