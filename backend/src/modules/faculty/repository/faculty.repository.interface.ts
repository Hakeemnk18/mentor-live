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
  FacultyPublicProfileView,
  FacultyView,
  FacultyViewForUser,
  FeaturedFacultyView,
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

  /**
   * Find faculty details + a specific slot from FacultySlotCollection.
   * variantId is required so we can look up the correct price.
   */
  findFacultyWithSlot(
    facultyId: string,
    slotId: string,
    variantId: string,
  ): Promise<FacultyDetailsViewForUser | null>;

  /**
   * Find faculty details + its first available slot for a given variant.
   */
  findFacultyWithFirstAvailableSlot(
    facultyId: string,
    variantId: string,
  ): Promise<FacultyDetailsViewForUser | null>;

  getChapterSlot(
    facultyId: string,
    chapterId: string,
  ): Promise<ChapterSlotProps | null>;

  addToChapterSlotPool(
    facultyId: string,
    chapterSlotId: string,
    studentId: string,
  ): Promise<void>;

  findFacultyByQuery(query: Record<string, any>): Promise<Faculty | null>;

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

  setChapterSlotAvailability(
    facultyId: string,
    chapterId: string,
    isAvailable: boolean,
  ): Promise<void>;

  /**
   * Public profile: basic faculty info + subject offerings.
   * Optionally filtered to offerings matching classId+syllabusId.
   */
  findFacultyPublicProfile(
    id: string,
    classId?: string,
    syllabusId?: string,
  ): Promise<FacultyPublicProfileView | null>;

  /**
   * Count faculty currently marked as featured (excluding the given id, if any).
   * Used to enforce the max-8 featured faculty limit on create/edit.
   */
  countFeatured(excludeId?: string): Promise<number>;

  /** Active, non-deleted faculty marked as featured — for the landing page. */
  findFeatured(limit: number): Promise<FeaturedFacultyView[]>;

  getFacultyCountInRange(startDate: Date, endDate: Date): Promise<number>;
  getDailyFacultyKpiStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{ _id: string; count: number }[]>;
}
