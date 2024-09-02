import { createSignal, createEffect, For } from "solid-js";
import { readUsers, readClassForms, readSubjects, readAssignments } from "../../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentPublic } from "../../client";

const TeachersAssignments = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [assignments, setAssignments] = createSignal<AssignmentPublic[]>([]);
  const [loading, setLoading] = createSignal<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersData, classesData, subjectsData, assignmentsData] = await Promise.all([
        readUsers(),
        readClassForms(),
        readSubjects(),
        readAssignments(),
      ]);

      setTeachers(teachersData.data);
      setClasses(classesData.data);
      setSubjects(subjectsData.data);
      setAssignments(assignmentsData.data);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedAssignments = () => {
    return classes().map((classForm) => {
      const classAssignments = assignments().filter(
        (assignment) => assignment.class_form_id === classForm.id
      );
      return {
        classForm,
        assignments: classAssignments.map((assignment) => ({
          subject: subjects().find((s) => s.id === assignment.subject_id),
          teacher: teachers().find((t) => t.id === assignment.teacher_id),
        })),
      };
    });
  };

  createEffect(() => {
    fetchData();
  });

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Teachers and Assignments</h2>

      {loading() ? (
        <p class="text-center">Loading assignments...</p>
      ) : (
        <div class="overflow-x-auto">
          <For each={groupedAssignments()}>
            {({ classForm, assignments }) => (
              <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {classForm.name}
                </h3>
                <table class="min-w-full bg-white dark:bg-gray-800">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Subject</th>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={assignments}>
                      {({ subject, teacher }, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {subject ? subject.name : "Unknown Subject"}
                          </td>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {teacher ? teacher.full_name : "Unknown Teacher"}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            )}
          </For>
        </div>
      )}
    </section>
  );
};

export default TeachersAssignments;
