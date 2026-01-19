import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import { Faculty } from "../entities/faculty.entity.js";
import type {
  FacultyChapterSearchFilters,
  FacultyClassAndSyllabusSearchFilters,
  FacultyFullAdminView,
  FacultyView,
  FacultyViewForUser,
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
}
