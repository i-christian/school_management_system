import { createSignal } from "solid-js";
import { readUsers, readClassForms, readSubjects, readAssignments } from "../client";
import type { UserPublic, ClassFormPublic, SubjectPublic, AssignmentPublic } from "../client";


export const useFetchSchoolData = () => {
  const [teachers, setTeachers] = createSignal<UserPublic[]>([]);
  const [classes, setClasses] = createSignal<ClassFormPublic[]>([]);
  const [subjects, setSubjects] = createSignal<SubjectPublic[]>([]);
  const [assignments, setAssignments] = createSignal<AssignmentPublic[]>([]);
  const [loading, setLoading] = createSignal<boolean>(true);
  const [error, setError] = createSignal<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return {
    teachers,
    classes,
    subjects,
    assignments,
    loading,
    error,
  };
};
