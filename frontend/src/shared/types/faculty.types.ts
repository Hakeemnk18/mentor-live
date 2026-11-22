export type FacultyImagePayload = {
  url: string;
  publicId: string;
};

export type FacultySlotPayload = {
  time: string; // ISO string
};

/**
 * Per-variant slot group — sent to the backend as `subjectSlots[]`.
 * One entry per subject variant the faculty teaches.
 */
export type SubjectSlotGroup = {
  variantId: string;
  times: { time: string }[]; // ISO date strings
};

/** subjects is now an array of { variantId, price } — price lives per variant */
export type CreateFacultyPayload = {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image?: FacultyImagePayload;
  isFeatured?: boolean;
  subjects: { variantId: string; price: number }[];
  /** Time-based slots keyed per variant — replaces the old flat slots[] */
  subjectSlots?: SubjectSlotGroup[];
  chapterSlots?: { chapter: string }[];
};

export type UpdateFacultyPayload = {
  name?: string;
  qualifications?: string[];
  description?: string;
  demoClass?: string;
  image?: { url: string; publicId: string };
  isFeatured?: boolean;
  subjects?: { variantId: string; price: number }[];
  /** class times for subjects added in this edit (required by the API for each new subject) */
  subjectSlots?: SubjectSlotGroup[];
};

/** Lightweight card shape returned by the dedicated featured-faculty endpoint */
export type FeaturedFaculty = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  image: { url: string; publicId: string };
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
  isFeatured: boolean;
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
  /** variantId this slot belongs to (from FacultySlot collection) */
  variantId: string;
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
  isFeatured: boolean;
  subjectOffering: SubjectOffering[];
  /** Slots now live in FacultySlot collection — each has a variantId */
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
  /**
   * Time slots assigned to this subject group's variants.
   * Key = variantId, value = HH:mm strings.
   */
  slotTimes: Record<string, string[]>;
};

export type FacultyModalData = {
  name?: string;
  qualifications?: string[];
  description?: string;
  demoClass?: string;
  isFeatured?: boolean;
  image?: string | { url: string; publicId: string };
  subjectOffering?: SubjectOffering[];
  slots?: {
    id?: string;
    variantId?: string;
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
