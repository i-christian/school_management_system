
import { createSignal, createEffect, Switch, Match, For } from "solid-js";
import { readUsers, readClassForms, readSubjects, readAssignments } from "../../../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentPublic } from "../../../client";
import AssignmentModal from "./AssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";
import DeleteAssignmentModal from "./DeleteAssignmentModal";
import { useAuth } from "../../../context/UserContext";

const AssignmentManagement = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [formattedAssignments, setFormattedAssignments] = createSignal<AssignmentPublic[]>([]);
  const [loading, setLoading] = createSignal<boolean>(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = createSignal<"add" | "edit" | "delete" | null>(null);
  const [editAssignmentId, setEditAssignmentId] = createSignal<string>("");
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
    setIsAssignmentModalOpen(null);
  };

  return (
    <section class="flex flex-col p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Assignment Management</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setIsAssignmentModalOpen("add")}
          disabled={loading()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden lg:block">Add Assignment</span>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Switch>
          <Match when={loading()}>
            <p class="text-center col-span-full">Loading assignments...</p>
          </Match>
          <Match when={formattedAssignments().length === 0 && !loading()}>
            <p class="text-center col-span-full">No assignments available.</p>
          </Match>
          <Match when={formattedAssignments().length > 0}>
            <For each={formattedAssignments()}>
              {(assignment) => (
                <div class="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                  <h3 class="text-lg font-bold mb-2">
                    {subjects().find(s => s.id === assignment.subject_id)?.name || "Unknown Subject"}
                  </h3>
                  <p class="mb-2">
                    Teacher: {teachers().find(t => t.id === assignment.teacher_id)?.full_name || "Unknown Teacher"}
                  </p>
                  <p class="mb-2">
                    Class: {classes().find(c => c.id === assignment.class_form_id)?.name || "Unknown Class"}
                  </p>
                  <div class="flex justify-between">
                    <button
                      class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      onClick={() => {
                        setEditAssignmentId(assignment.id);
                        setIsAssignmentModalOpen("edit");
                      }}
                      disabled={loading()}
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => {
                        setEditAssignmentId(assignment.id);
                        setIsAssignmentModalOpen("delete");
                      }}
                      disabled={loading()}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </For>
          </Match>
        </Switch>
      </div>

      <Switch>
        <Match when={isAssignmentModalOpen() === "add"}>
          <AssignmentModal
            teachers={teachers()}
            classes={classes()}
            subjects={subjects()}
            existingAssignments={formattedAssignments()}
            onClose={() => setIsAssignmentModalOpen(null)}
            onAssignmentCreated={handleAssignmentCreated}
          />
        </Match>
        <Match when={isAssignmentModalOpen() === "edit" && editAssignmentId()}>
          <EditAssignmentModal
            assignment={formattedAssignments().find((a) => a.id === editAssignmentId())!}
            teachers={teachers()}
            classes={classes()}
            subjects={subjects()}
            existingAssignments={formattedAssignments()}
            onClose={() => setIsAssignmentModalOpen(null)}
            onAssignmentUpdated={handleAssignmentCreated}
          />
        </Match>
        <Match when={isAssignmentModalOpen() === "delete" && editAssignmentId()}>
          <DeleteAssignmentModal
            assignmentId={editAssignmentId()}
            onClose={() => setIsAssignmentModalOpen(null)}
            onAssignmentDeleted={handleAssignmentCreated}
          />
        </Match>
      </Switch>
    </section>
  );
};

export default AssignmentManagement;
