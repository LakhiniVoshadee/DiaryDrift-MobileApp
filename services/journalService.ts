import { db } from "@/firebase";
import { Journal } from "@/types/journal";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const journalColRef = collection(db, "journals");

export const createJournal = async (
  journal: Omit<Journal, "id" | "dateCreated" | "dateModified">
) => {
  const now = new Date().toISOString();
  const docRef = await addDoc(journalColRef, {
    ...journal,
    dateCreated: now,
    dateModified: now,
  });
  return docRef.id;
};

export const getAllJournalData = async (): Promise<Journal[]> => {
  const snapshot = await getDocs(journalColRef);
  return snapshot.docs.map((journalRef) => ({
    id: journalRef.id,
    ...journalRef.data(),
  })) as Journal[];
};

export const getJournalById = async (id: string): Promise<Journal | null> => {
  const journalDocRef = doc(db, "journals", id);
  const snapshot = await getDoc(journalDocRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Journal;
};

export const updateJournal = async (
  id: string,
  journal: Omit<Journal, "id" | "dateCreated" | "dateModified">
) => {
  const docRef = doc(db, "journals", id);
  await updateDoc(docRef, {
    ...journal,
    dateModified: new Date().toISOString(),
  });
};

// DELETE
export const deleteJournal = async (id: string) => {
  const docRef = doc(db, "journals", id);
  await deleteDoc(docRef);
};