import { Component, For, Switch, Match, createSignal, onMount } from "solid-js";
import { StudentPublic, StudentsPublic, readClassForm, readStudents } from "../../../client";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";

const Students: Component = () => {
  const [students, setStudents] = createSignal<{ data: any[]; count: number }>({ data: [], count: 0 });
  const [modalType, setModalType] = createSignal<"edit" | "add" | "delete" | null>(null);
  const [selectedStudentId, setSelectedStudentId] = createSignal<string | null>(null);

  const loadStudents = async () => {
    try {
      const response: StudentsPublic = await readStudents();
      const studentsData: Array<StudentPublic> = response.data;
      const classNameMap: Record<string, string> = {};

      await Promise.all(
        studentsData.map(async (student) => {
          const className = await readClassForm({ id: student.form_id });
          classNameMap[student.form_id] = className.name;
        })
      );

      const sortedStudents = [...studentsData].sort((a, b) => {
        const lastNameCompare = a.last_name.localeCompare(b.last_name);
        if (lastNameCompare === 0) {
          return a.first_name.localeCompare(b.first_name);
        }
        return lastNameCompare;
      });

      const groupedStudents = sortedStudents.reduce((groups, student) => {
        const className = classNameMap[student.form_id] || "Unknown Class";
        if (!groups[className]) {
          groups[className] = [];
        }
        groups[className].push(student);
        return groups;
      }, {} as Record<string, any[]>);

      const groupedArray = Object.entries(groupedStudents);

      setStudents({ data: groupedArray, count: response.count });
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  onMount(() => {
    loadStudents();
  });

  const handleStudentAction = () => {
    loadStudents();
    setModalType(null);
    setSelectedStudentId(null);
  };

  return (
    <section class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Students</h2>
      <div class="flex justify-between items-center mb-4">
        <button
          class="p-3 w-fit rounded-md bg-blue-500 hover:bg-blue-700 dark:text-white font-semibold flex items-center"
          onClick={() => setModalType("add")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden lg:block">Add Student</span>
        </button>
        <p class="text-md font-bold text-gray-600 dark:text-gray-300">Number of Students: {students().count}</p>
      </div>

      <For each={students().data}>
        {([className, studentsInClass]) => (
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{className}</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">First Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Middle Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact Phone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <For each={studentsInClass}>
                    {(studentItem, index) => (
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{index() + 1}</td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{studentItem.last_name}</td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{studentItem.first_name}</td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{studentItem.middle_name || "N/A"}</td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{studentItem.contact || "N/A"}</td>
                        <td class="px-6 py-4 text-sm font-medium text-right">
                          <button
                            class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            onClick={() => {
                              setSelectedStudentId(studentItem.id);
                              setModalType("edit");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {
                              setSelectedStudentId(studentItem.id);
                              setModalType("delete");
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </For>

      <Switch>
        <Match when={modalType() === "add"}>
          <AddStudentModal onClose={handleStudentAction} />
        </Match>
        <Match when={modalType() === "edit" && selectedStudentId()}>
          <EditStudentModal studentId={selectedStudentId()!} onClose={handleStudentAction} />
        </Match>
        <Match when={modalType() === "delete" && selectedStudentId()}>
          <DeleteStudentModal
            studentId={selectedStudentId()!}
            onClose={handleStudentAction}
            onStudentDeleted={handleStudentAction}
          />
        </Match>
      </Switch>
    </section>
  );
};

export default Students;
