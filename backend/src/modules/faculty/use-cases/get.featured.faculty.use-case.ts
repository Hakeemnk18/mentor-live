import { inject, injectable } from "tsyringe";
import type { IGetFeaturedFacultyUseCase } from "./interfaces/get.featured.faculty.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FeaturedFacultyView } from "../types/faculty.type.js";

const FEATURED_FACULTY_LIMIT = 8;

@injectable()
export class GetFeaturedFacultyUseCase implements IGetFeaturedFacultyUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

  async execute(): Promise<FeaturedFacultyView[]> {
    return this._facultyRepository.findFeatured(FEATURED_FACULTY_LIMIT);
  }
}
