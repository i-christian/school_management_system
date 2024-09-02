import { createSignal, createEffect, Show, For } from "solid-js";
import { readUsers, readClassForms, readSubjects, readAssignments } from "../../../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentPublic } from "../../../client";
import AssignmentModal from "./AssignmentModal";
import { useAuth } from "../../../context/UserContext";

const AssignmentManagement = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [formattedAssignments, setFormattedAssignments] = createSignal<AssignmentPublic[]>([]);
  const [loading, setLoading] = createSignal<boolean>(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = createSignal<boolean>(false);
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
      setFormattedAssignments(assignmentsData.data);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const handleAssignmentCreated = () => {
    fetchData();
    setIsAssignmentModalOpen(false);
  };

  return (
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Assignment Management</h1>
      <button
        onClick={() => setIsAssignmentModalOpen(true)}
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Add Assignment
      </button>
      <Show when={isAssignmentModalOpen()}>
        <AssignmentModal
          teachers={teachers()}
          classes={classes()}
          subjects={subjects()}
          existingAssignments={formattedAssignments()}
          onClose={() => setIsAssignmentModalOpen(false)}
          onAssignmentCreated={handleAssignmentCreated}
        />
      </Show>
      <Show
        when={loading()}
        fallback={
          <div>
            <div class="mt-6">
              <h2 class="text-lg font-bold mb-2">Available Assignments</h2>
              <ul>
                <For each={formattedAssignments()}>
                  {(assignment) => (
                    <li>
                      {teachers().find(t => t.id === assignment.teacher_id)?.full_name || "Unknown Teacher"},
                      {classes().find(c => c.id === assignment.class_form_id)?.name || "Unknown Class"},
                      {subjects().find(s => s.id === assignment.subject_id)?.name || "Unknown Subject"}
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        }
      >
        <div class="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </Show>
    </div>
  );
};

export default AssignmentManagement;
