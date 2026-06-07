import type { FeaturedFacultyView } from "../../types/faculty.type.js";

export interface IGetFeaturedFacultyUseCase {
  execute(): Promise<FeaturedFacultyView[]>;
}
