import Types from "mongoose";
import type {
  IdNameView,
  IdOnlyView,
} from "../../../core/shared/type/id.type.js";
import type { ImageValue } from "../../../core/shared/type/image.type.js";
import type { SubjectVariantWithSubjectView } from "../../subject-variant/type/subject.variant.type.js";
import type { IFaculty } from "../infrastructure/faculty.schema.js";
import type { AllFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import type { FacultySlotAdminView } from "../../faculty-slot/types/faculty.slot.type.js";

export interface ChapterSlotProps {
  id?: string;
  chapterId: string;
  isAvailable: boolean;
  pool: string[];
  poolLimit: number;
}

export interface SubjectOfferingItem {
  variantId: string;
  price: number;
}

export interface FacultyProps {
  id: string | null;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: ImageValue;
  subjectOffering: SubjectOfferingItem[];
  chapterSlots: ChapterSlotProps[];
  isDeleted: boolean;
  isFeatured: boolean;
}

export type FacultyChapterSlotView = Omit<
  ChapterSlotProps,
  "chapterId" | "pool"
> & {
  id: string;
  isAvailable: boolean;
  chapter: IdNameView;
  pool: IdOnlyView[];
};

export type FacultyView = {
  id: string | null;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: {
    url: string;
    publicId: string;
  };
  isDeleted: boolean;
  isFeatured: boolean;
};

export type FacultySubjectOfferingView = SubjectVariantWithSubjectView & {
  price: number;
};

export interface FacultyFullAdminView extends Omit<FacultyView, "id"> {
  id: string;
  /** Time-based slots now come from the FacultySlot collection */
  slots: FacultySlotAdminView[];
  chapterSlots: FacultyChapterSlotView[];
  subjectOffering: FacultySubjectOfferingView[];
}

export type FacultyPopulatedLean = Omit<
  IFaculty,
  "subjectOffering" | "chapterSlots"
> & {
  _id: Types.ObjectId;

  subjectOffering: {
    variantId: {
      _id: Types.ObjectId;
      class: { _id: Types.ObjectId; name: string };
      syllabus: { _id: Types.ObjectId; name: string };
      subject: { _id: Types.ObjectId; name: string };
    };
    price: number;
  }[];

  chapterSlots: {
    _id: Types.ObjectId;
    isAvailable: boolean;
    chapter: { _id: Types.ObjectId; name: string };
    pool: { _id: Types.ObjectId }[];
    poolLimit: number;
  }[];
};

export type FacultyChapterSearchFilters = {
  chapterId: string | undefined;
} & AllFiltersBase;

export type FacultyClassAndSyllabusSearchFilters = {
  subjectVariantIds: string[];
  subjectId: string | undefined;
} & AllFiltersBase;

export type FacultyViewForUser = {
  id: string | null;
  name: string;
  qualifications: string[];
  description: string;
  price: number;
  image: string;
};

export type FacultyDetailsViewForUser = FacultyViewForUser & {
  demoClass: string;
  slot: FacultyChapterSlotView | FacultySlotForUser;
};

export type FacultySlotForUser = {
  id: string;
  time: Date;
  isAvailable: boolean;
  pool: IdOnlyView[];
  poolLimit: number;
};

export type SlotMode = "slot" | "chapter";

/** Public faculty profile returned without requiring a slot or chapter context */
export type FacultyPublicProfileView = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string;
  /** Only offerings that match the optional classId+syllabusId filter */
  subjectOffering: {
    variantId: string;
    subjectName: string;
    className: string;
    syllabusName: string;
    price: number;
  }[];
};

/** Lightweight card view for the landing page's featured-faculty section */
export type FeaturedFacultyView = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  image: {
    url: string;
    publicId: string;
  };
};

export interface SetSlotAvailabilityDto {
  slotId: string;
  isAvailable: boolean;
}
