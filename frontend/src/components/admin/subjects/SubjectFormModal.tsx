import { Component, createSignal, onMount } from "solid-js";
import { createSubject, updateSubject, readSubject, readSubjects, SubjectCreate, SubjectsPublic } from "../../../client";

interface SubjectFormModalProps {
  subjectId?: string;
  onClose: () => void;
  onSubjectAdded?: () => void;
  onSubjectUpdated?: () => void;
}

const SubjectFormModal: Component<SubjectFormModalProps> = (props) => {
  const [subjectData, setSubjectData] = createSignal<SubjectCreate>({ name: "" });
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [existingSubjectNames, setExistingSubjectNames] = createSignal<string[]>([]);

  onMount(async () => {
    if (props.subjectId) {
      try {
        const data = await readSubject({ id: props.subjectId });
        setSubjectData(data);
      } catch (error) {
        console.error("Failed to load subject data:", error);
      }
    }

    try {
      const response: SubjectsPublic = await readSubjects();
      setExistingSubjectNames(response.data.map(subj => subj.name.toUpperCase().trim()));
    } catch (error) {
      console.error("Failed to load existing subjects:", error);
    }
  });

  const normalizeSubjectName = (name: string): string => {
    return name.toUpperCase().trim();
  };

  const validateSubjectName = (name: string): boolean => {
    const pattern = /^[A-Z][A-Z0-9]*$/; // Example pattern for subject names (e.g., "MATH101")
    return pattern.test(name);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const name = normalizeSubjectName(subjectData().name);
    if (!validateSubjectName(name)) {
      setError("Subject name must follow the pattern: 'SubjectName', e.g., 'MATH101'.");
      setLoading(false);
      return;
    }

    try {
      if (props.subjectId) {
        const existingSubject = await readSubject({ id: props.subjectId });
        const existingName = normalizeSubjectName(existingSubject.name);

        if (existingSubjectNames().includes(name) && name !== existingName) {
          setError("Subject name already exists.");
          setLoading(false);
          return;
        }

        await updateSubject({ id: props.subjectId, requestBody: { ...subjectData(), name } });
        props.onSubjectUpdated?.();
      } else {
        if (existingSubjectNames().includes(name)) {
          setError("Subject name already exists.");
          setLoading(false);
          return;
        }

        await createSubject({ requestBody: { ...subjectData(), name } });
        props.onSubjectAdded?.();
      }
      props.onClose();
    } catch (error) {
      console.error("Failed to save subject:", error);
      setError("An error occurred while saving the subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{props.subjectId ? "Edit Subject" : "Add New Subject"}</h3>
        <input
          type="text"
          class={`w-full p-2 mb-4 border border-gray-300 rounded-md ${error() ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}`}
          placeholder="Subject Name (e.g., MATH101)"
          value={subjectData().name}
          onInput={(e) => {
            setSubjectData({ ...subjectData(), name: e.currentTarget.value });
            setError(null);
          }}
        />
        {error() && <p class="text-red-500 mb-4">{error()}</p>}
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSave}
            disabled={loading()}
          >
            {loading() ? "Saving..." : "Save"}
          </button>
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectFormModal;
