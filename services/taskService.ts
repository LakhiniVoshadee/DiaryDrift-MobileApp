import { db } from "@/firebase";
import { Task } from "@/types/tasks";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import api from "./config/api";

export const taskColRef = collection(db, "tasks");
export const getAllTask = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const addTasks = async (task: any) => {
  const res = await api.post("/tasks", task);
  return res.data;
};

// firebase firestore

export const createTask = async (task: Task) => {
  const docRef = await addDoc(taskColRef, task);
  return docRef.id;
};

export const updateTask = async (id: string, task: Task) => {
  const docRef = doc(db, "tasks", id);
  const { id: _id, ...taskData } = task;
  return await updateDoc(docRef, taskData);
};

export const deleteTask = async (id: string) => {
  const docRef = doc(db, "tasks", id);
  return await deleteDoc(docRef);
};

export const getAllTaskData = async () => {
  const snapshot = await getDocs(taskColRef);
  const taskList: Task[] = snapshot.docs.map((taskRef) => ({
    id: taskRef.id,
    ...taskRef.data(),
  })) as Task[];
  return taskList;
};

export const getTaskById = async (id: string) => {
  const taskDocRef = doc(db, "tasks", id);
  const snapshot = await getDoc(taskDocRef);
  const task = snapshot.exists()
    ? ({
        id: snapshot.id,
        ...snapshot.data(),
      } as Task)
    : null;
  return task;
};

export const getAllTaskByUserId = async (userId: string) => {
  const q = query(taskColRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const taskList: Task[] = snapshot.docs.map((taskRef) => ({
    id: taskRef.id,
    ...taskRef.data(),
  })) as Task[];
  return taskList;
};
