import { createSignal } from "solid-js";
import { readUsers, readClassForms, readSubjects, createAssignment } from "../../../client";
import { For } from "solid-js";
import type {
  UserPublic,
  ClassFormPublic,
  SubjectPublic,
  AssignmentCreate
} from "../../../client";
import useCustomToast from "../../../hooks/useCustomToast";


const AssignmentManagement = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [selectedTeacher, setSelectedTeacher] = createSignal<string>("");
  const [selectedClass, setSelectedClass] = createSignal<string>("");
  const [selectedSubject, setSelectedSubject] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(true);

  const { showToast } = useCustomToast();

  const fetchData = async () => {
    try {
      const [teachersData, classesData, subjectsData] = await Promise.all([
        readUsers(),
        readClassForms(),
        readSubjects()
      ]);

      setTeachers(teachersData.data);
      setClasses(classesData.data);
      setSubjects(subjectsData.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      showToast("Error", "Failed to fetch data.", "error");
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  const handleAssignment = async () => {
    try {
      if (!selectedTeacher() || !selectedClass() || !selectedSubject()) {
        showToast("Validation Error", "Please select teacher, class, and subject.", "error");
        return;
      }

      const assignmentData: AssignmentCreate = {
        teacher_id: selectedTeacher(),
        class_form_id: selectedClass(),
        subject_id: selectedSubject()
      };

      await createAssignment({ requestBody: assignmentData });

      showToast("Success", "Assignment created successfully.", "success");
    } catch (error) {
      console.error("Failed to create assignment", error);
      showToast("Error", "Failed to create assignment.", "error");
    }
  };

  return (
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Assignment Management</h1>
      {loading() ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div class="mb-4">
            <label class="block mb-2">Select Teacher</label>
            <select
              value={selectedTeacher()}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Teacher</option>
              <For each={teachers()} fallback={<option>Loading teachers...</option>}>
                {(teacher) => (
                  <option value={teacher.id}>
                    {teacher.full_name || teacher.email}
                  </option>
                )}
              </For>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2">Select Class</label>
            <select
              value={selectedClass()}
              onChange={(e) => setSelectedClass(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Class</option>
              <For each={classes()} fallback={<option>Loading classes...</option>}>
                {(classForm) => (
                  <option value={classForm.id}>
                    {classForm.name}
                  </option>
                )}
              </For>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2">Select Subject</label>
            <select
              value={selectedSubject()}
              onChange={(e) => setSelectedSubject(e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Subject</option>
              <For each={subjects()} fallback={<option>Loading subjects...</option>}>
                {(subject) => (
                  <option value={subject.id}>
                    {subject.name}
                  </option>
                )}
              </For>
            </select>
          </div>

          <button
            onClick={handleAssignment}
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Assign
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
