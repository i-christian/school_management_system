import { Component, createMemo, createSignal, For, lazy, Show } from 'solid-js';
import { useGrades } from '../../hooks/useGrades';
import { useFetchSchoolData } from '../../hooks/useFetchSchoolData';
import { useAuth } from '../../context/UserContext';
import { StudentPublic } from '../../client';

const ConfirmationModal = lazy(() => import('./ConfirmationModal'));


const MyStudents: Component<{ onUpdateMessage: (message: string) => void }> = (props) => {
  const { studentsByClass, grades, loading, createOrUpdateGrade, handleDeleteClassGrades, fetchData } = useGrades(props.onUpdateMessage);
  const { classes, subjects, assignments } = useFetchSchoolData();
  const { user } = useAuth();

  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const [selectedClass, setSelectedClass] = createSignal<string | null>(null);
  const [editingGrades, setEditingGrades] = createSignal<Map<string, Map<string, { score: number, remark: string }>>>(new Map());

  const filteredClasses = createMemo(() => {
    const subjectsMap = new Map(subjects().map((s) => [s.id, s.name]));
    const userAssignments = assignments().filter((assignment) => assignment.teacher_id === user()?.id);

    return classes()
      .map((classForm) => {
        const classSubjects = userAssignments
          .filter((assignment) => assignment.class_form_id === classForm.id)
          .map((assignment) => ({
            subjectId: assignment.subject_id,
            subjectName: subjectsMap.get(assignment.subject_id) || 'Unknown Subject',
          }));

        return {
          ...classForm,
          subjects: classSubjects,
        };
      })
      .filter((classItem) => classItem.subjects.length > 0);
  });

  const validateAndFormatGrade = (value: string): number => {
    const floatValue = parseFloat(value);
    return isNaN(floatValue) ? 0 : Math.max(0, Math.min(100, floatValue));
  };

  const validateRemark = (remark: string): string => {
    return typeof remark === 'string' ? remark.substring(0, 200) : '';
  };

  const sortStudentsBySurname = (students: StudentPublic[]) => {
    return [...students].sort((a, b) => a.last_name.localeCompare(b.last_name));
  };

  const handleSaveClick = (classFormId: string) => {
    setSelectedClass(classFormId);
    setShowSaveModal(true);
  };

  const handleDeleteClick = (classFormId: string) => {
    setSelectedClass(classFormId);
    setShowDeleteModal(true);
  };

  const confirmSave = async () => {
    if (selectedClass()) {
      const gradesToUpdate = editingGrades();
      for (const [studentId, subjectGrades] of gradesToUpdate) {
        for (const [subjectId, gradeData] of subjectGrades) {
          await createOrUpdateGrade(studentId, subjectId, gradeData.score, gradeData.remark);
        }
      }
      setShowSaveModal(false);
      fetchData();
    }
  };

  const confirmDelete = async () => {
    if (selectedClass()) {
      await handleDeleteClassGrades(selectedClass()!);
      setShowDeleteModal(false);
      fetchData();
    }
  };

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Grades by Class</h2>

      <For each={filteredClasses()}>
        {(classForm) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{classForm.name}</h3>
            <Show when={studentsByClass().get(classForm.id)} fallback={<p class="text-gray-500 dark:text-gray-400">No students in this class</p>}>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-blue-500 dark:text-blue-400 tracking-wider">#</th>
                      <th class="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-blue-500 dark:text-blue-400 tracking-wider">Student</th>
                      <For each={classForm.subjects}>
                        {(subject) => (
                          <>
                            <th class="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-blue-500 dark:text-blue-400 tracking-wider">{subject.subjectName} Score</th>
                            <th class="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-blue-500 dark:text-blue-400 tracking-wider">{subject.subjectName} Remark</th>
                          </>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={sortStudentsBySurname(studentsByClass().get(classForm.id) || [])}>
                      {(student, index) => (
                        <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 dark:border-gray-600 text-center">{index() + 1}</td>
                          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 dark:border-gray-600">
                            {student.last_name} {student.middle_name ? `${student.middle_name} ` : ' '} {student.first_name}
                          </td>
                          <For each={classForm.subjects}>
                            {(subject) => {
                              const grade = grades().get(student.id)?.get(subject.subjectId);
                              const editingGradesMap = editingGrades();
                              if (!editingGradesMap.has(student.id)) {
                                editingGradesMap.set(student.id, new Map());
                              }
                              if (!editingGradesMap.get(student.id)?.has(subject.subjectId)) {
                                editingGradesMap.get(student.id)?.set(subject.subjectId, {
                                  score: grade?.score ?? 0,
                                  remark: grade?.remark ?? '',
                                });
                              }

                              return (
                                <>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 dark:border-gray-600">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      value={editingGradesMap.get(student.id)?.get(subject.subjectId)?.score ?? ''}
                                      onInput={(e) => {
                                        const value = e.currentTarget.value;
                                        const formattedGrade = validateAndFormatGrade(value);
                                        setEditingGrades((prev) => {
                                          const updated = new Map(prev);
                                          updated.get(student.id)?.set(subject.subjectId, {
                                            ...updated.get(student.id)?.get(subject.subjectId)!,
                                            score: formattedGrade
                                          });
                                          return updated;
                                        });
                                      }}
                                      class="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
                                      placeholder="Grade (%)"
                                    />
                                  </td>
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 dark:border-gray-600">
                                    <input
                                      type="text"
                                      value={editingGradesMap.get(student.id)?.get(subject.subjectId)?.remark ?? ''}
                                      onInput={(e) => {
                                        const remark = validateRemark(e.currentTarget.value);
                                        setEditingGrades((prev) => {
                                          const updated = new Map(prev);
                                          updated.get(student.id)?.set(subject.subjectId, {
                                            ...updated.get(student.id)?.get(subject.subjectId)!,
                                            remark
                                          });
                                          return updated;
                                        });
                                      }}
                                      class="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
                                      placeholder="Teacher's remark"
                                      maxLength={200}
                                    />
                                  </td>
                                </>
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
            <div class="mt-4 flex items-center space-x-4">
              <button
                onClick={() => handleSaveClick(classForm.id)}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Saving...' : `Save Grades for ${classForm.name}`}
              </button>
              <button
                onClick={() => handleDeleteClick(classForm.id)}
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading()}
              >
                {loading() ? 'Deleting...' : `Delete Grades for ${classForm.name}`}
              </button>
            </div>
          </div>
        )}
      </For>

      <Show when={showSaveModal()}>
        <ConfirmationModal
          title="Save Grades"
          message="Are you sure you want to save the grades for this class?"
          onConfirm={confirmSave}
          onCancel={() => setShowSaveModal(false)}
        />
      </Show>

      <Show when={showDeleteModal()}>
        <ConfirmationModal
          title="Delete Grades"
          message="Are you sure you want to delete all grades for this class?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </Show>
    </section>
  );
};

export default MyStudents;
