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
    <section class="flex flex-col p-6">
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
              <table class="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">#</th>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Last Name</th>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">First Name</th>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Middle Name</th>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Contact Phone</th>
                    <th scope="col" class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={studentsInClass}>
                    {(studentItem, index) => (
                      <tr class={index() % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{index() + 1}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-gray-800 dark:text-gray-100">{studentItem.last_name}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-gray-800 dark:text-gray-100">{studentItem.first_name}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-gray-800 dark:text-gray-100">{studentItem.middle_name || "N/A"}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-gray-800 dark:text-gray-100">{studentItem.contact || "N/A"}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                          <div class="flex items-center justify-end space-x-2">
                            <button
                              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                              onClick={() => {
                                setSelectedStudentId(studentItem.id);
                                setModalType("edit");
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                              </svg>
                            </button>
                            <button
                              class="p-2 ml-2 rounded-md text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              onClick={() => {
                                setSelectedStudentId(studentItem.id);
                                setModalType("delete");
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.111 48.111 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
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
