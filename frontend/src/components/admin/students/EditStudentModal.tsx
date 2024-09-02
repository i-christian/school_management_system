import { Component, createSignal, onMount } from "solid-js";
import { readStudent, updateStudent, readClassForms, ClassFormsPublic, ClassFormPublic } from "../../../client";
import { For } from "solid-js";

const EditStudentModal: Component<{ studentId: string; onClose: () => void }> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [middleName, setMiddleName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [contact, setContact] = createSignal("");
  const [formId, setFormId] = createSignal<string>("");
  const [classForms, setClassForms] = createSignal<ClassFormPublic[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const student = await readStudent({ id: props.studentId });
      setFirstName(student.first_name || "");
      setMiddleName(student.middle_name || "");
      setLastName(student.last_name || "");
      setContact(student.contact || "");
      setFormId(student.form_id || "");

      const response: ClassFormsPublic = await readClassForms();
      setClassForms(response.data);
    } catch (error) {
      console.error("Failed to fetch student or class forms:", error);
    }
  });

  const validatePhone = (input: string): boolean => {
    return /^(\+\d{1,3}|\d{1,4})\d{6,14}$/.test(input);
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
      await updateStudent({
        id: props.studentId,
        requestBody: {
          first_name: firstName() || undefined,
          middle_name: middleName() || null,
          last_name: lastName() || undefined,
          contact: contact() || null,
          form_id: formId() || undefined,
        },
      });
      props.onClose();
    } catch (error) {
      console.error("Failed to update student:", error);
      setError("An error occurred while updating the student.");
    }
  };

  const handleFormChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    setFormId(target.value);
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Edit Student</h3>
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
                <option value={cls.id} selected={cls.id === formId()}>
                  {cls.name}
                </option>
              )}
            </For>
          </select>
        </div>
        {error() && <p class="text-red-500 mb-4">{error()}</p>}
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Save
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

export default EditStudentModal;
