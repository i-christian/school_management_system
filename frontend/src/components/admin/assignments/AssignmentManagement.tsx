import { createSignal, createEffect, Show, For } from "solid-js";
import { readUsers, readClassForms, readSubjects, createAssignment, readAssignments } from "../../../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentCreate, AssignmentPublic } from "../../../client";
import Modal from "./Modal";
import { useAuth } from "../../../context/UserContext";

const AssignmentManagement = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [assignments, setAssignments] = createSignal<AssignmentPublic[]>([]);
  const [selectedTeacher, setSelectedTeacher] = createSignal<string>("");
  const [selectedClass, setSelectedClass] = createSignal<string>("");
  const [selectedSubject, setSelectedSubject] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(true);
  const [modal, setModal] = createSignal<{ title: string; message: string } | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersData, classesData, subjectsData, assignmentsData] = await Promise.all([
        readUsers(),
        readClassForms(),
        readSubjects(),
        readAssignments(),
      ]);

      setTeachers(
        teachersData.data.filter((teacher) => !user()?.is_superuser || teacher.id !== user()?.id)
      );
      setClasses(classesData.data);
      setSubjects(subjectsData.data);
      setAssignments(assignmentsData.data);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const handleAssignment = async () => {
    try {
      if (!selectedTeacher() || !selectedClass() || !selectedSubject()) {
        setModal({ title: "Validation Error", message: "Please select teacher, class, and subject." });
        return;
      }

      const existingAssignment = assignments().find(
        (assignment) =>
          assignment.teacher_id === selectedTeacher() &&
          assignment.class_form_id === selectedClass() &&
          assignment.subject_id === selectedSubject()
      );

      if (existingAssignment) {
        setModal({ title: "Duplicate Assignment", message: "This assignment already exists." });
        return;
      }

      const assignmentData: AssignmentCreate = {
        teacher_id: selectedTeacher(),
        class_form_id: selectedClass(),
        subject_id: selectedSubject(),
      };

      await createAssignment({ requestBody: assignmentData });

      setModal({ title: "Success", message: "Assignment created successfully." });

      setSelectedTeacher("");
      setSelectedClass("");
      setSelectedSubject("");

      fetchData();
    } catch (error) {
      setModal({ title: "Error", message: "Failed to create assignment." });
    }
  };

  return (
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Assignment Management</h1>
      <Show
        when={modal()}
        fallback={
          <>
            {loading() ? (
              <div class="flex justify-center items-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div>
                <div class="mb-4">
                  <label class="block mb-2 text-gray-700 dark:text-gray-300">Select Teacher</label>
                  <select
                    value={selectedTeacher()}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    class="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
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
                  <label class="block mb-2 text-gray-700 dark:text-gray-300">Select Class</label>
                  <select
                    value={selectedClass()}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    class="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Class</option>
                    <For each={classes()} fallback={<option>Loading classes...</option>}>
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
                    <For each={subjects()} fallback={<option>Loading subjects...</option>}>
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
              </div>
            )}
          </>
        }
      >
        {(modalContent) => (
          <Modal
            title={modalContent().title}
            message={modalContent().message}
            onClose={() => setModal(null)}
          />
        )}
      </Show>
    </div>
  );
};

export default AssignmentManagement;
