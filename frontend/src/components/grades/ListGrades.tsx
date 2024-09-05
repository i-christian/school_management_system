import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { GradePublic, StudentPublic, SubjectPublic } from '../../client';
import { readStudents, readSubjects, readGrades, readClassForms } from '../../client';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';


const ListGrades: Component = () => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [unfilteredData, setUnfilteredData] = createSignal<{
    studentsByClass: Map<string, StudentPublic[]>;
    subjects: SubjectPublic[];
    grades: Map<string, Map<string, GradePublic>>;
  }>({
    studentsByClass: new Map(),
    subjects: [],
    grades: new Map(),
  });
  const { classes } = useFetchSchoolData();


  const fetchUnfilteredData = async () => {
    setIsLoading(true);
    try {
      const [studentsResponse, subjectsResponse, gradesResponse] = await Promise.all([
        readStudents(),
        readSubjects(),
        readGrades(),
        readClassForms(),
      ]);

      const studentsGroupedByClass = new Map<string, StudentPublic[]>();
      studentsResponse.data.forEach((student: StudentPublic) => {
        const formId = student.form_id;
        if (!studentsGroupedByClass.has(formId)) {
          studentsGroupedByClass.set(formId, []);
        }
        studentsGroupedByClass.get(formId)?.push(student);
      });

      const gradesMap = new Map<string, Map<string, GradePublic>>();
      gradesResponse.data.forEach((grade: GradePublic) => {
        if (!gradesMap.has(grade.student_id)) {
          gradesMap.set(grade.student_id, new Map());
        }
        gradesMap.get(grade.student_id)?.set(grade.subject_id, grade);
      });

      setUnfilteredData({
        studentsByClass: studentsGroupedByClass,
        subjects: subjectsResponse.data,
        grades: gradesMap,
      });
    } catch (error) {
      console.error('Error fetching unfiltered data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUnfilteredData();

  const sortedStudents = (students: StudentPublic[]) =>
    students.slice().sort((a, b) => a.last_name.localeCompare(b.last_name));

  const classData = createMemo(() => {
    const classMap = new Map();
    classes().forEach((cls) => {
      classMap.set(cls.id, cls.name);
    });
    return classMap;
  });

  const renderSubjectHeader = (subject: SubjectPublic) => (
    <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
      {subject.name}
    </th>
  );

  const renderStudentRow = (student: StudentPublic, index: () => number) => (
    <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">{index() + 1}</td>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        {student.last_name} {student.middle_name ? `${student.middle_name} ` : ' '} {student.first_name}
      </td>
      <For each={unfilteredData().subjects}>
        {(subject) => {
          const grade = unfilteredData().grades.get(student.id)?.get(subject.id);
          return (
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              {grade ? grade.score : 'N/A'}
            </td>
          );
        }}
      </For>
    </tr>
  );

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Student's Overall Grades</h2>

      <Show when={isLoading()}>
        <div class="flex items-center justify-center h-64">
          <div class="w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </Show>

      <Show when={!isLoading()}>
        {Array.from(unfilteredData().studentsByClass.entries()).map(([classId, students]) => (
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
                      <For each={unfilteredData().subjects}>
                        {renderSubjectHeader}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={sortedStudents(students)}>{renderStudentRow}</For>
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
