export type FacultyImagePayload = {
  url: string;
  publicId: string;
};

export type FacultySlotPayload = {
  time: string; // ISO string
};

/** subjects is now an array of { variantId, price } — price lives per variant */
export type CreateFacultyPayload = {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image?: FacultyImagePayload;
  subjects: { variantId: string; price: number }[];
  slots?: FacultySlotPayload[];
};

export type UpdateFacultyPayload = {
  name?: string;
  qualifications?: string[];
  description?: string;
  demoClass?: string;
  image?: { url: string; publicId: string };
  subjects?: { variantId: string; price: number }[];
};

export type FacultyListParams = {
  syllabusId: string;
  classId: string;
  subjectId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export type FacultyListItem = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  price: number;
  image?: string;
};

export type FacultyByChapterParams = {
  chapterId: string;
  page?: number;
  limit?: number;
  search?: string;
};

export type FacultyRow = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string | { url: string; publicId: string };
  isDeleted: boolean;
};

/** price is now per subject offering, not top-level */
export type SubjectOffering = {
  id: string;
  price: number;
  subject: { id: string; name: string };
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
};

export type TimeSlot = {
  id: string;
  time: string;
  isAvailable: boolean;
  poolLimit: number;
  pool: unknown[];
};

export type ChapterSlot = {
  id: string;
  chapter: string | { id: string; name: string };
  isAvailable: boolean;
  poolLimit: number;
  pool: unknown[];
};

export type FacultyData = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string | { url: string; publicId: string };
  isDeleted: boolean;
  subjectOffering: SubjectOffering[];
  slots: TimeSlot[];
  chapterSlots: ChapterSlot[];
};

export type ImagePayload = { url: string; publicId: string };

export type SubjectVariant = { _id: string; subjectName: string };

export type SubjectGroup = {
  id: number;
  syllabusId: string;
  classId: string;
  variants: SubjectVariant[];
  selected: string[];
  selectedVariants: SubjectVariant[];
  /** price per variantId */
  prices: Record<string, number>;
};

export type FacultyModalData = {
  name?: string;
  qualifications?: string[];
  description?: string;
  demoClass?: string;
  image?: string | { url: string; publicId: string };
  subjectOffering?: SubjectOffering[];
  slots?: {
    id?: string;
    time: string;
    isAvailable?: boolean;
    pool?: unknown[];
  }[];
  chapterSlots?: {
    id?: string;
    chapter: string | { id: string; name: string };
    pool?: unknown[];
    isAvailable?: boolean;
  }[];
};

export type FacultyInitialData = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string | { url: string; publicId: string };
  subjects: { variantId: string; price: number }[];
};

export type SubjectOfferingUI = {
  id: string;
  subjectName: string;
  className: string;
  syllabusName: string;
};
