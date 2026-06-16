import type { FacultyPublicProfileView } from "../../types/faculty.type.js";

export interface IGetFacultyPublicProfileUseCase {
  execute(
    facultyId: string,
    classId?: string,
    syllabusId?: string,
  ): Promise<FacultyPublicProfileView>;
}
