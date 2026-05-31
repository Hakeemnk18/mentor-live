import type { ClientSession } from "mongoose";
import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import type { AddChapterSlotRequestDto } from "../dtos/add.chapter.dto.js";
import { Faculty } from "../entities/faculty.entity.js";
import type {
  ChapterSlotProps,
  FacultyChapterSearchFilters,
  FacultyClassAndSyllabusSearchFilters,
  FacultyDetailsViewForUser,
  FacultyFullAdminView,
  FacultyView,
  FacultyViewForUser,
  SetSlotAvailabilityDto,
  SlotProps,
  AvailableSlots,
} from "../types/faculty.type.js";
import type { RemoveUserFromPoolDto } from "../../booking/dto/remove.student.from.pooling.dto.js";

export interface IFacultyRepository {
  create(facultyEntity: Faculty): Promise<Faculty>;
  findById(id: string): Promise<Faculty | null>;
  findByName(name: string): Promise<Faculty | null>;
  save(facultyEntity: Faculty): Promise<Faculty>;
  findAllFacultyForAdmin(
    allDoc: AcademicListFiltersBase,
  ): Promise<{ data: FacultyView[]; total: number }>;
  findFacultyFullByIdForAdmin(id: string): Promise<FacultyFullAdminView | null>;
  findFacultyByChapter(
    dto: FacultyChapterSearchFilters,
  ): Promise<FacultyViewForUser[]>;
  findFacultyByClassAndSyllabus(
    dto: FacultyClassAndSyllabusSearchFilters,
  ): Promise<FacultyViewForUser[]>;
  findFacultyFullByIdAndChapter(
    facultyId: string,
    chapterId: string,
  ): Promise<FacultyDetailsViewForUser | null>;
  findFacultyFullByIdAndSlot(
    facultyId: string,
    slotId: string,
    variantId?: string,
  ): Promise<FacultyDetailsViewForUser | null>;
  findFacultyByIdWithFirstSlot(
    facultyId: string,
    variantId?: string,
  ): Promise<FacultyDetailsViewForUser | null>;
  getSlot(facultyId: string, slotId: string): Promise<SlotProps | null>;
  getChapterSlot(
    facultyId: string,
    chapterId: string,
  ): Promise<ChapterSlotProps | null>;
  addToSlotPool(
    facultyId: string,
    slotId: string,
    studentId: string,
  ): Promise<void>;
  addToChapterSlotPool(
    facultyId: string,
    chapterSlotId: string,
    studentId: string,
  ): Promise<void>;
  findFacultyByQuery(query: Record<string, any>): Promise<Faculty | null>;
  consumeSlot(
    facultyId: string,
    slotId: string,
    session?: ClientSession,
  ): Promise<void>;
  consumeSlots(
    facultyId: string,
    slotIds: string[],
    session?: ClientSession,
  ): Promise<void>;
  getAllSlots(facultyId: string): Promise<SlotProps[]>;
  addSlots(facultyId: string, slots: { time: Date }[]): Promise<void>;
  addChapterSlots(
    facultyId: string,
    slots: AddChapterSlotRequestDto,
  ): Promise<void>;
  consumeChapterSlot(
    facultyId: string,
    chapterId: string,
    session: ClientSession,
  ): Promise<void>;
  removeUserFromPool(
    params: RemoveUserFromPoolDto,
    session: ClientSession,
  ): Promise<void>;
  setSlotAvailability(params: SetSlotAvailabilityDto): Promise<void>;
  getAllAvailableSlots(facultyId: string): Promise<AvailableSlots[]>;
  getFacultyCountInRange(startDate: Date, endDate: Date): Promise<number>;
  getDailyFacultyKpiStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{ _id: string; count: number }[]>;
}
