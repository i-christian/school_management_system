import { createSignal, onCleanup } from "solid-js";
import { readStudent, updateStudent } from "../../../client";

const EditStudentModal: Component<{ studentId: string; onClose: () => void }> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [formId, setFormId] = createSignal("");

  onCleanup(() => {
    // Cleanup or reset state if necessary
  });

  const fetchStudent = async () => {
    try {
      const student = await readStudent({ id: props.studentId });
      setFirstName(student.first_name);
      setLastName(student.last_name);
      setFormId(student.form_id);
    } catch (error) {
      console.error("Failed to fetch student:", error);
    }
  };

  fetchStudent();

  const handleSubmit = async () => {
    try {
      await updateStudent({
        id: props.studentId,
        requestBody: { first_name: firstName(), last_name: lastName(), form_id: formId() },
      });
      props.onClose();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  return (
    <div class="modal">
      <div class="modal-content">
        <h3 class="text-xl font-semibold">Edit Student</h3>
        <input type="text" placeholder="First Name" value={firstName()} onInput={(e) => setFirstName(e.currentTarget.value)} />
        <input type="text" placeholder="Last Name" value={lastName()} onInput={(e) => setLastName(e.currentTarget.value)} />
        <input type="text" placeholder="Class Form ID" value={formId()} onInput={(e) => setFormId(e.currentTarget.value)} />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditStudentModal;
