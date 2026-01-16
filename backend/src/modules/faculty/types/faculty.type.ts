export interface SlotProps {
  id?: string;
  time: Date;
  isAvailable: boolean;
  pool: string[];        // userIds
  poolLimit: number;
}

export interface ChapterSlotProps {
  id?: string;
  chapterId: string;
  isAvailable: boolean;
  pool: string[];        // userIds
  poolLimit: number;
}

export interface FacultyProps {
  id: string | null;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string;
  price: number;
  subjectOffering: string[];   // SubjectVariant IDs
  slots: SlotProps[];
  chapterSlots: ChapterSlotProps[];
  isDeleted: boolean;
}