import { Component } from "solid-js";
import { deleteStudent } from "../../../client";


const DeleteStudentModal: Component<{ studentId: string; onClose: () => void }> = (props) => {
  const handleDelete = async () => {
    try {
      await deleteStudent({ id: props.studentId });
      props.onClose();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return (
    <div class="modal">
      <div class="modal-content">
        <h3 class="text-xl font-semibold">Delete Student</h3>
        <p>Are you sure you want to delete this student?</p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteStudentModal;
