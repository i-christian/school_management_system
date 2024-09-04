import { createSignal, For, Show } from "solid-js";
import { createAssignment } from "../../../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentCreate, AssignmentPublic } from "../../../client";

interface AssignmentModalProps {
  teachers: UserPublic[];
  classes: ClassFormPublic[];
  subjects: SubjectPublic[];
  existingAssignments: AssignmentPublic[];
  onClose: () => void;
  onAssignmentCreated: () => void;
}

const AssignmentModal = (props: AssignmentModalProps) => {
  const [selectedTeacher, setSelectedTeacher] = createSignal<string>("");
  const [selectedClass, setSelectedClass] = createSignal<string>("");
  const [selectedSubject, setSelectedSubject] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const handleAssignment = async () => {
    try {
      if (!selectedTeacher() || !selectedClass() || !selectedSubject()) {
        setErrorMessage("Please select teacher, class, and subject.");
        return;
      }

      const isDuplicate = props.existingAssignments.some(
        (assignment) =>
          assignment.teacher_id === selectedTeacher() &&
          assignment.class_form_id === selectedClass() &&
          assignment.subject_id === selectedSubject()
      );

      if (isDuplicate) {
        setErrorMessage("This assignment already exists.");
        return;
      }

      const isConflict = props.existingAssignments.some(
        (assignment) =>
          assignment.class_form_id === selectedClass() &&
          assignment.subject_id === selectedSubject()
      );

      if (isConflict) {
        setErrorMessage("Another teacher is already assigned to this class and subject.");
        return;
      }

      const assignmentData: AssignmentCreate = {
        teacher_id: selectedTeacher(),
        class_form_id: selectedClass(),
        subject_id: selectedSubject(),
      };

      await createAssignment({ requestBody: assignmentData });

      props.onAssignmentCreated();
      setSelectedTeacher("");
      setSelectedClass("");
      setSelectedSubject("");
      props.onClose();
    } catch (error) {
      setErrorMessage("Failed to create assignment.");
    }
  };


  return (
    <>
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="p-6 rounded shadow-md w-96 bg-slate-300 dark:bg-slate-800 relative">
          <h2 class="text-lg font-bold mb-4 text-gray-600 dark:text-gray-200">Create Assignment</h2>

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
            onClick={handleAssignment}
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Assign
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

export default AssignmentModal;
