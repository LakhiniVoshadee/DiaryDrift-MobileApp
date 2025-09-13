import { db } from "@/firebase";
import { Task } from "@/types/tasks";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
} from "firebase/firestore";

// Collection reference for tasks
export const taskColRef = collection(db, "tasks");

// CREATE
export const createTask = async (task: Omit<Task, "id">) => {
  const docRef = await addDoc(taskColRef, task);
  return docRef.id;
};

// READ ALL
export const getAllTaskData = async (): Promise<Task[]> => {
  const snapshot = await getDocs(taskColRef);
  return snapshot.docs.map((taskRef) => ({
    id: taskRef.id,
    ...taskRef.data(),
  })) as Task[];
};

// READ ONE
export const getTaskById = async (id: string): Promise<Task | null> => {
  const taskDocRef = doc(db, "tasks", id);
  const snapshot = await getDoc(taskDocRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Task;
};

// UPDATE
export const updateTask = async (id: string, task: Omit<Task, "id">) => {
  const docRef = doc(db, "tasks", id);
  await updateDoc(docRef, { ...task });
};

// DELETE
export const deleteTask = async (id: string) => {
  const docRef = doc(db, "tasks", id);
  await deleteDoc(docRef);
};