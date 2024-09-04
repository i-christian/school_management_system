import { createSignal, createMemo, For } from "solid-js";
import { useFetchSchoolData } from "../../hooks/useFetchSchoolData";


const TeachersAssignments = () => {
  const { teachers, classes, subjects, assignments, loading, error } = useFetchSchoolData();

  const [classFilter, setClassFilter] = createSignal<string>("");
  const [subjectFilter, setSubjectFilter] = createSignal<string>("");
  const [teacherFilter, setTeacherFilter] = createSignal<string>("");

  const groupedAssignments = createMemo(() => {
    const subjectsMap = new Map(subjects().map((s) => [s.id, s.name]));
    const teachersMap = new Map(teachers().map((t) => [t.id, t.full_name]));

    return classes()
      .filter((classForm) => classForm.name.toLowerCase().includes(classFilter().toLowerCase()))
      .map((classForm) => {
        const classAssignments = assignments()
          .filter(
            (assignment) =>
              assignment.class_form_id === classForm.id &&
              (!subjectFilter() || subjectsMap.get(assignment.subject_id)?.toLowerCase().includes(subjectFilter().toLowerCase())) &&
              (!teacherFilter() || teachersMap.get(assignment.teacher_id)?.toLowerCase().includes(teacherFilter().toLowerCase()))
          );

        const formattedAssignments = classAssignments.map((assignment) => ({
          subject: subjectsMap.get(assignment.subject_id) || "Unknown Subject",
          teacher: teachersMap.get(assignment.teacher_id) || "Unknown Teacher",
        }));

        return {
          className: classForm.name,
          assignments: formattedAssignments,
        };
      })
      .filter((group) => group.assignments.length > 0);
  });

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Teachers and Assignments</h2>

      {error() && (
        <p class="text-red-500 text-center mb-4" role="alert">
          {error()}
        </p>
      )}

      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by class"
          value={classFilter()}
          onInput={(e) => setClassFilter(e.currentTarget.value)}
          class="p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by subject"
          value={subjectFilter()}
          onInput={(e) => setSubjectFilter(e.currentTarget.value)}
          class="p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by teacher"
          value={teacherFilter()}
          onInput={(e) => setTeacherFilter(e.currentTarget.value)}
          class="p-2 border rounded-md"
        />
      </div>

      {loading() ? (
        <p class="text-center">Loading assignments...</p>
      ) : (
        <div class="overflow-x-auto">
          <For each={groupedAssignments()}>
            {({ className, assignments }) => (
              <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {className}
                </h3>
                <table class="min-w-full bg-white dark:bg-gray-800">
                  <thead>
                    <tr>
                      <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Subject</th>
                      <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={assignments}>
                      {({ subject, teacher }, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {subject}
                          </td>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {teacher}
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
