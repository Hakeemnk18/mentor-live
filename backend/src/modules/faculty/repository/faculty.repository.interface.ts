import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import { Faculty } from "../entities/faculty.entity.js";
import type {
  ChapterSlotProps,
  FacultyChapterSearchFilters,
  FacultyClassAndSyllabusSearchFilters,
  FacultyDetailsViewForUser,
  FacultyFullAdminView,
  FacultyView,
  FacultyViewForUser,
  SlotProps,
} from "../types/faculty.type.js";

export interface IFacultyRepository {
  create(facultyEntity: Faculty): Promise<Faculty>;
  findById(id: string): Promise<Faculty | null>;
  findByName(name: string): Promise<Faculty | null>;
  save(facultyEntity: Faculty): Promise<Faculty>;
  findAllFacultyForAdmin(
    allDoc: AcademicListFiltersBase,
  ): Promise<{ data: FacultyView[]; total: number }>;
  findFacultyFullByIdForAdmin(id: string): Promise<FacultyFullAdminView | null>;
  findFacultyByChapter(dto: FacultyChapterSearchFilters): Promise<FacultyViewForUser[]>;
  findFacultyByClassAndSyllabus(dto: FacultyClassAndSyllabusSearchFilters): Promise<FacultyViewForUser[]>
  findFacultyFullByIdAndChapter(facultyId: string, chapterId: string): Promise<FacultyDetailsViewForUser | null >
  findFacultyFullByIdAndSlot(facultyId: string, slotId: string): Promise<FacultyDetailsViewForUser | null >
  findFacultyByIdWithFirstSlot(facultyId: string): Promise<FacultyDetailsViewForUser | null >
  getSlot(facultyId: string, slotId: string): Promise< SlotProps | null>
  getChapterSlot(facultyId: string, chapterId: string): Promise<ChapterSlotProps | null>
  addToSlotPool(facultyId: string, slotId: string, studentId: string): Promise<void>
  addToChapterSlotPool(facultyId: string, chapterSlotId: string, studentId: string): Promise<void>
  findFacultyByQuery(query: Record<string, any>): Promise<Faculty | null>;
}
