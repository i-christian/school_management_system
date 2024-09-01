import { Component, createSignal, onMount } from "solid-js";
import { createClassForm, updateClassForm, readClassForm, ClassFormCreate } from "../../../client";

interface ClassFormModalProps {
  classId?: string;
  onClose: () => void;
  onClassAdded?: () => void;
  onClassUpdated?: () => void;
}

const ClassFormModal: Component<ClassFormModalProps> = (props) => {
  const [classFormData, setClassFormData] = createSignal<ClassFormCreate>({ name: "" });
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    if (props.classId) {
      try {
        const data = await readClassForm({ id: props.classId });
        setClassFormData(data);
      } catch (error) {
        console.error("Failed to load class form data:", error);
      }
    }
  });

  const normalizeClassName = (name: string): string => {
    return name.toUpperCase().trim();
  };

  const validateClassName = (name: string): boolean => {
    const pattern = /^FORM [1-4][MR]$/; // Pattern to match "Form 1M", "Form 1R", "Form 2M", etc.
    return pattern.test(name);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const name = normalizeClassName(classFormData().name);
    if (!validateClassName(name)) {
      setError("Class name must follow the pattern: 'Form [number][M/R]', e.g., 'Form 1M'.");
      setLoading(false);
      return;
    }

    try {
      if (props.classId) {
        await updateClassForm({ id: props.classId, requestBody: { ...classFormData(), name } });
        props.onClassUpdated?.();
      } else {
        await createClassForm({ requestBody: { ...classFormData(), name } });
        props.onClassAdded?.();
      }
      props.onClose();
    } catch (error) {
      console.error("Failed to save class form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{props.classId ? "Edit Class" : "Add New Class"}</h3>
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="Class Name (e.g., Form 1M)"
          value={classFormData().name}
          onInput={(e) => {
            setClassFormData({ ...classFormData(), name: e.currentTarget.value });
            setError(null);
          }}
        />
        {error() && <p class="text-red-500 mb-4">{error()}</p>}
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSave}
            disabled={loading()}
          >
            {loading() ? "Saving..." : "Save"}
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

export default ClassFormModal;
