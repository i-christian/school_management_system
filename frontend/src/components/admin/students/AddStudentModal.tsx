import { createSignal } from "solid-js";
import { createStudent } from "../../../client";


const AddStudentModal: Component<{ onClose: () => void }> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [formId, setFormId] = createSignal("");

  const handleSubmit = async () => {
    try {
      await createStudent({
        requestBody: { first_name: firstName(), last_name: lastName(), form_id: formId() },
      });
      props.onClose();
    } catch (error) {
      console.error("Failed to create student:", error);
    }
  };

  return (
    <div class="modal">
      <div class="modal-content">
        <h3 class="text-xl font-semibold">Add Student</h3>
        <input type="text" placeholder="First Name" onInput={(e) => setFirstName(e.currentTarget.value)} />
        <input type="text" placeholder="Last Name" onInput={(e) => setLastName(e.currentTarget.value)} />
        <input type="text" placeholder="Class Form ID" onInput={(e) => setFormId(e.currentTarget.value)} />
        <button onClick={handleSubmit}>Add</button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddStudentModal;
