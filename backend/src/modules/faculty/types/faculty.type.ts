import Types from "mongoose";
import type {
  IdNameView,
  IdOnlyView,
} from "../../../core/shared/type/id.type.js";
import type { ImageValue } from "../../../core/shared/type/image.type.js";
import type { SubjectVariantWithSubjectView } from "../../subject-variant/type/subject.variant.type.js";
import type { IFaculty } from "../infrastructure/faculty.schema.js";
import type { AllFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";

export interface SlotProps {
  id?: string;
  time: Date;
  isAvailable: boolean;
  pool: string[];
  poolLimit: number;
}

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
  slots: SlotProps[];
  chapterSlots: ChapterSlotProps[];
  isDeleted: boolean;
}

export type FacultySlotView = Omit<SlotProps, "time" | "pool"> & {
  id: string;
  time: string;
  isAvailable: boolean;
  pool: IdOnlyView[];
};

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
};

export type FacultySubjectOfferingView = SubjectVariantWithSubjectView & {
  price: number;
};

export interface FacultyFullAdminView extends Omit<FacultyView, "id"> {
  id: string;
  slots: FacultySlotView[];
  chapterSlots: FacultyChapterSlotView[];
  subjectOffering: FacultySubjectOfferingView[];
}

export type FacultyPopulatedLean = Omit<
  IFaculty,
  "subjectOffering" | "chapterSlots" | "slots"
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

  slots: {
    _id: Types.ObjectId;
    time: Date;
    isAvailable: boolean;
    pool: { _id: Types.ObjectId }[];
    poolLimit: number;
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
  slot: FacultySlotView | FacultyChapterSlotView;
};

export type SlotMode = "slot" | "chapter";

export interface SetSlotAvailabilityDto {
  facultyId: string;
  mode: SlotMode;
  slotId?: string;
  chapterId?: string;
  isAvailable: boolean;
}

export type AvailableSlots = {
  id: string;
  time: Date;
};
