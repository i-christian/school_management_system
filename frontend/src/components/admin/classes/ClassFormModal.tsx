import { Component, createEffect, createSignal } from "solid-js";
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

  createEffect(async () => {
    if (props.classId) {
      try {
        const data = await readClassForm({ id: props.classId });
        setClassFormData(data);
      } catch (error) {
        console.error("Failed to load class form data:", error);
      }
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (props.classId) {
        await updateClassForm({ id: props.classId, requestBody: classFormData() });
        props.onClassUpdated?.();
      } else {
        await createClassForm({ requestBody: classFormData() });
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
          class="w-full p-2 mb-4 Class Nameborder border-gray-300 rounded-md"
          placeholder="Class Name"
          value={classFormData().name}
          onInput={(e) => setClassFormData({ ...classFormData(), name: e.currentTarget.value })}
        />
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
