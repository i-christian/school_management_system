import { Component, createSignal, onMount } from "solid-js";
import { createStudent, readClassForms, ClassFormsPublic, ClassFormPublic } from "../../../client";
import { For } from "solid-js";

const AddStudentModal: Component<{ onClose: () => void }> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [middleName, setMiddleName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [contact, setContact] = createSignal("");
  const [formId, setFormId] = createSignal<string>("");
  const [classForms, setClassForms] = createSignal<ClassFormPublic[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  const validatePhone = (input: string): boolean => {
    return /^(\+265|0)\d{9}$/.test(input);
  };

  const handleSubmit = async () => {
    setError(null);

    if (contact() && !validatePhone(contact())) {
      setError("Contact number must be at least 10 digits long and start with 0 or +265.");
      return;
    }

    if (!formId()) {
      setError("Please select a class form.");
      return;
    }

    try {
      await createStudent({
        requestBody: {
          first_name: firstName(),
          middle_name: middleName() || null,
          last_name: lastName(),
          contact: contact() || null,
          form_id: formId()
        },
      });
      props.onClose();
    } catch (error) {
      console.error("Failed to create student:", error);
      setError("An error occurred while creating the student.");
    }
  };

  onMount(async () => {
    try {
      const response: ClassFormsPublic = await readClassForms();
      setClassForms(response.data);
    } catch (error) {
      console.error("Failed to load class forms:", error);
    }
  });

  const handleFormChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    setFormId(selectedId);
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add Student</h3>
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="First Name"
          value={firstName()}
          onInput={(e) => setFirstName(e.currentTarget.value)}
        />
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="Middle Name (optional)"
          value={middleName()}
          onInput={(e) => setMiddleName(e.currentTarget.value)}
        />
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="Last Name"
          value={lastName()}
          onInput={(e) => setLastName(e.currentTarget.value)}
        />
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="Contact (optional)"
          value={contact()}
          onInput={(e) => setContact(e.currentTarget.value)}
        />
        {error() && <p class="text-red-500 mb-4">{error()}</p>}
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-1">Class Form</label>
          <select
            class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formId() || ""}
            onChange={handleFormChange}
          >
            <option value="">Select a class form</option>
            <For each={classForms()}>
              {(cls) => (
                <option value={cls.id}>{cls.name}</option>
              )}
            </For>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Add
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

export default AddStudentModal;
