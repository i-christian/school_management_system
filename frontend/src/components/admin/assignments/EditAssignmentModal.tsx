import { createSignal, For, Show } from "solid-js";
import { updateAssignment } from "../../../client";
import type {
  UserPublic,
  ClassFormPublic,
  SubjectPublic,
  AssignmentUpdate,
  AssignmentPublic,
} from "../../../client";

interface EditAssignmentModalProps {
  assignment: AssignmentPublic;
  teachers: UserPublic[];
  classes: ClassFormPublic[];
  subjects: SubjectPublic[];
  existingAssignments: AssignmentPublic[];
  onClose: () => void;
  onAssignmentUpdated: () => void;
}

const EditAssignmentModal = (props: EditAssignmentModalProps) => {
  const [selectedTeacher, setSelectedTeacher] = createSignal<string>(props.assignment.teacher_id);
  const [selectedClass, setSelectedClass] = createSignal<string>(props.assignment.class_form_id);
  const [selectedSubject, setSelectedSubject] = createSignal<string>(props.assignment.subject_id);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const handleAssignmentUpdate = async () => {
    try {
      if (!selectedTeacher() || !selectedClass() || !selectedSubject()) {
        setErrorMessage("Please select teacher, class, and subject.");
        return;
      }

      const isDuplicate = props.existingAssignments.some(
        (assignment) =>
          assignment.id !== props.assignment.id &&
          assignment.teacher_id === selectedTeacher() &&
          assignment.class_form_id === selectedClass() &&
          assignment.subject_id === selectedSubject()
      );

      if (isDuplicate) {
        setErrorMessage("An assignment with this teacher, class, and subject already exists.");
        return;
      }

      const assignmentData: AssignmentUpdate = {
        teacher_id: selectedTeacher(),
        class_form_id: selectedClass(),
        subject_id: selectedSubject(),
      };

      await updateAssignment({
        id: props.assignment.id,
        requestBody: assignmentData,
      });

      props.onAssignmentUpdated();
      props.onClose();
    } catch (error) {
      setErrorMessage("Failed to update assignment.");
    }
  };

  return (
    <>
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="p-6 rounded shadow-md w-96 bg-slate-300 dark:bg-slate-800 relative">
          <h2 class="text-lg font-bold mb-4 text-gray-600 dark:text-gray-200">Edit Assignment</h2>

          <Show when={errorMessage()}>
            <div class="mb-4 p-2 bg-red-200 text-red-800 rounded">
              {errorMessage()}
            </div>
          </Show>

          <div class="mb-4">
            <label class="block mb-2 text-gray-700 dark:text-gray-300">Select Teacher</label>
            <select
              value={selectedTeacher()}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Teacher</option>
              <For each={props.teachers} fallback={<option>Loading teachers...</option>}>
                {(teacher) => (
                  <option value={teacher.id}>
                    {teacher.full_name || teacher.email}
                  </option>
                )}
              </For>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-gray-700 dark:text-gray-300">Select Class</label>
            <select
              value={selectedClass()}
              onChange={(e) => setSelectedClass(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Class</option>
              <For each={props.classes} fallback={<option>Loading classes...</option>}>
                {(classForm) => <option value={classForm.id}>{classForm.name}</option>}
              </For>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-gray-700 dark:text-gray-300">Select Subject</label>
            <select
              value={selectedSubject()}
              onChange={(e) => setSelectedSubject(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Subject</option>
              <For each={props.subjects} fallback={<option>Loading subjects...</option>}>
                {(subject) => <option value={subject.id}>{subject.name}</option>}
              </For>
            </select>
          </div>

          <button
            onClick={handleAssignmentUpdate}
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update
          </button>

          <button
            onClick={props.onClose}
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default EditAssignmentModal;
