export interface Journal {
  id?: string;
  title: string;
  description: string;
  dateCreated?: string;
  dateModified?: string;
  photoBase64?: string;
  voiceNoteBase64?: string;
}