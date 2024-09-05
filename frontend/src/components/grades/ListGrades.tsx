import { Component, createSignal, For, Show, createMemo } from 'solid-js';
import { useGrades } from '../../hooks/useGrades';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';
import { GradePublic, StudentPublic, SubjectPublic } from '../../client';

const ListGrades: Component = () => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [gradesData, setGradesData] = createSignal<{
    studentsByClass: Map<string, StudentPublic[]>;
    subjects: SubjectPublic[];
    grades: Map<string, Map<string, GradePublic>>;
  }>({
    studentsByClass: new Map(),
    subjects: [],
    grades: new Map(),
  });

  const { studentsByClass, subjects, grades, fetchData } = useGrades((message) => {
    console.log(message);
  });

  const { classes } = useFetchSchoolData();

  fetchData().then(() => {
    setGradesData({
      studentsByClass: studentsByClass() || new Map(),
      subjects: subjects() || [],
      grades: grades() || new Map(),
    });
    setIsLoading(false);
  });

  const sortedStudents = (students: StudentPublic[]) =>
    students.slice().sort((a, b) => a.last_name.localeCompare(b.last_name));

  const classData = createMemo(() => {
    const classMap = new Map();
    classes().forEach((cls) => {
      classMap.set(cls.id, cls.name);
    });
    return classMap;
  });

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Grades by Class</h2>

      <Show when={isLoading()}>
        <div class="flex items-center justify-center h-64">
          <div class="w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </Show>

      <Show when={!isLoading()}>
        {Array.from(gradesData().studentsByClass.entries()).map(([classId, students]) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {classData().get(classId) || 'Unknown Class'}
            </h3>
            <Show when={students.length > 0} fallback={<p class="text-gray-500">No students in this class</p>}>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">#</th>
                      <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Student</th>
                      <For each={gradesData().subjects}>
                        {(subject) => (
                          <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                            {subject.name}
                          </th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={sortedStudents(students)}>
                      {(student, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">{index() + 1}</td>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            {student.last_name} {student.middle_name ? `${student.middle_name} ` : ' '} {student.first_name}
                          </td>
                          <For each={gradesData().subjects}>
                            {(subject) => {
                              const grade = gradesData().grades.get(student.id)?.get(subject.id);
                              return (
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                  {grade ? grade.score : 'N/A'}
                                </td>
                              );
                            }}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </div>
        ))}
      </Show>
    </section>
  );
};

export default ListGrades;
