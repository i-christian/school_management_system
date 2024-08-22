import { createSignal, Accessor } from "solid-js";

type ToastStatus = "success" | "error";

interface ToastOptions {
  title: string;
  description: string;
  status: ToastStatus;
  duration?: number;
}

type ShowToast = (title: string, description: string, status: ToastStatus, duration?: number) => void;

interface ToastManager {
  toasts: Accessor<ToastOptions[]>;
  showToast: ShowToast;
}

const useCustomToast = (): ToastManager => {
  const [toasts, setToasts] = createSignal<ToastOptions[]>([]);

  const showToast: ShowToast = (title, description, status, duration = 5000) => {
    const toast: ToastOptions = { title, description, status, duration };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== toast));
    }, duration);
  };

  return {
    toasts,
    showToast,
  };
};

export default useCustomToast;
