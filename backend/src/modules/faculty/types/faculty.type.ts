import Types from "mongoose"
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
  pool: string[]; // userIds
  poolLimit: number;
}

export interface ChapterSlotProps {
  id?: string;
  chapterId: string;
  isAvailable: boolean;
  pool: string[]; // userIds
  poolLimit: number;
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

export interface FacultyProps {
  id: string | null;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: ImageValue;
  price: number;
  subjectOffering: string[]; // SubjectVariant IDs
  slots: SlotProps[];
  chapterSlots: ChapterSlotProps[];
  isDeleted: boolean;
}

export type FacultyView = Pick<
  FacultyProps,
  | "id"
  | "name"
  | "qualifications"
  | "description"
  | "demoClass"
  | "price"
  | "isDeleted"
> & {
  image: string;
};

export type FacultySubjectOfferingView = SubjectVariantWithSubjectView;

export interface FacultyFullAdminView extends Omit<FacultyView, "id"> {
  id: string;
  slots: FacultySlotView[];
  chapterSlots: FacultyChapterSlotView[];
  subjectOffering: FacultySubjectOfferingView[];
}


export type FacultyPopulatedLean = Omit<IFaculty, 
  | "subjectOffering"
  | "chapterSlots"
  | "slots"
> & {
  _id: Types.ObjectId;

  subjectOffering: {
    _id: Types.ObjectId;
    class: { _id: Types.ObjectId; name: string };
    syllabus: { _id: Types.ObjectId; name: string };
    subject: { _id: Types.ObjectId; name: string };
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

export type FacultyViewForUser = Pick<
  FacultyProps,
  | "id"
  | "name"
  | "qualifications"
  | "description"
  | "price"
> & {
  image: string;
};

export type FacultyDetailsViewForUser = FacultyViewForUser & {
  demoClass: string,
  slot: FacultySlotView | FacultyChapterSlotView
};