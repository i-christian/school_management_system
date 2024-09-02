import { Component, createSignal } from "solid-js";
import { readStudent, updateStudent } from "../../../client";

const EditStudentModal: Component<{ studentId: string; onClose: () => void }> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [middleName, setMiddleName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [contact, setContact] = createSignal("");
  const [formId, setFormId] = createSignal("");

  const fetchStudent = async () => {
    try {
      const student = await readStudent({ id: props.studentId });
      setFirstName(student.first_name || "");
      setMiddleName(student.middle_name || "");
      setLastName(student.last_name || "");
      setContact(student.contact || "");
      setFormId(student.form_id || "");
    } catch (error) {
      console.error("Failed to fetch student:", error);
    }
  };

  fetchStudent();

  const handleSubmit = async () => {
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
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-gray-800">
        <h3 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Edit Student</h3>
        <div class="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName()}
            onInput={(e) => setFirstName(e.currentTarget.value)}
            class="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Middle Name"
            value={middleName()}
            onInput={(e) => setMiddleName(e.currentTarget.value)}
            class="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName()}
            onInput={(e) => setLastName(e.currentTarget.value)}
            class="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Contact Phone"
            value={contact()}
            onInput={(e) => setContact(e.currentTarget.value)}
            class="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Class Form ID"
            value={formId()}
            onInput={(e) => setFormId(e.currentTarget.value)}
            class="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            onClick={handleSubmit}
            class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={props.onClose}
            class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
