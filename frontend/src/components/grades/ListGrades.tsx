import { Component, createSignal, For, Show, onMount, createMemo } from 'solid-js';
import { GradePublic, StudentPublic, SubjectPublic } from '../../client';
import { readStudents, readSubjects, readGrades } from '../../client';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';
import Spinner from '../util/Spinner';


const ListGrades: Component = () => {
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
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
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    fetchUnfilteredData();
  });

  const subjectsMemo = createMemo(() => unfilteredData().subjects);
  const gradesMemo = createMemo(() => unfilteredData().grades);

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

  const renderStudentRow = (
    student: StudentPublic,
    index: number,
    subjects: SubjectPublic[],
    grades: Map<string, Map<string, GradePublic>>
  ) => (
    <tr class={index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : ''}>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">{index + 1}</td>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        {student.last_name} {student.middle_name ? `${student.middle_name} ` : ' '} {student.first_name}
      </td>
      <For each={subjects}>
        {(subject) => {
          const grade = grades.get(student.id)?.get(subject.id);
          return (
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              <div class="flex justify-between items-center space-x-4">
                <div class="w-1/2 text-center font-bold text-sm text-gray-600 dark:text-gray-400">Score</div>
                <div class="w-1/2 text-center font-bold text-sm text-gray-600 dark:text-gray-400">Remark</div>
              </div>
              <div class="flex justify-between items-center space-x-4">
                <div
                  class="w-1/2 text-center font-semibold text-gray-900 dark:text-gray-300"
                  title={`Score for ${subject.name}`}
                >
                  {grade ? grade.score : 'N/A'}
                </div>
                <div
                  class="w-1/2 text-center text-sm text-gray-600 dark:text-gray-400 italic"
                  title={`Remark for ${subject.name}`}
                >
                  {grade ? grade.remark : 'No remark'}
                </div>
              </div>
            </td>
          );
        }}
      </For>
    </tr>
  );

  const StudentTable = (props: { students: StudentPublic[], subjects: SubjectPublic[], grades: Map<string, Map<string, GradePublic>> }) => {
    const sortedStudents = props.students.slice().sort((a, b) => a.last_name.localeCompare(b.last_name));

    return (
      <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">#</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Student</th>
            <For each={props.subjects}>{renderSubjectHeader}</For>
          </tr>
        </thead>
        <tbody>
          <For each={sortedStudents}>
            {(student, index) => renderStudentRow(student, index(), props.subjects, props.grades)}
          </For>
        </tbody>
      </table>
    );
  };

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Student's Overall Grades</h2>

      <Show when={isLoading()}>
        <Spinner />
      </Show>

      <Show when={error()}>
        <div class="text-red-500">{error()}</div>
      </Show>

      <Show when={!isLoading() && !error()}>
        {Array.from(unfilteredData().studentsByClass.entries()).map(([classId, students]) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {classData().get(classId) || 'Unknown Class'}
            </h3>
            <Show when={students.length > 0} fallback={<p class="text-gray-500">No students in this class</p>}>
              <div class="overflow-x-auto">
                <StudentTable students={students} subjects={subjectsMemo()} grades={gradesMemo()} />
              </div>
            </Show>
          </div>
        ))}
      </Show>

      <Show when={!isLoading() && !error() && unfilteredData().studentsByClass.size === 0}>
        <div class="text-gray-500 text-center">No data available</div>
      </Show>
    </section>
  );
};

export default ListGrades;
