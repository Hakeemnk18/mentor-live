import { inject, injectable } from "tsyringe";
import type { IFindFacultyByClassAndSyllabusUseCaseUseCase } from "./interfaces/find.faculty.by.class.and.syllabus.use-case.interface.js";
import type { GetAllFacultyBYClassAndSyllabusDto } from "../dtos/find.by.class.and.syllbus.dto.js";
import type { FacultyViewForUser } from "../types/faculty.type.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import { buildFacultySort } from "../utils/faculty-sort.util.js";

@injectable()
export class FindFacultyByClassAndSyllabusUseCaseUseCase implements IFindFacultyByClassAndSyllabusUseCaseUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,
  ) {}
  async execute(
    dto: GetAllFacultyBYClassAndSyllabusDto,
  ): Promise<FacultyViewForUser[]> {
    const { syllabusId, classId, subjectId, sortValue, limit, search, page } =
      dto;

    const subjectVariants = await this._subjectVariantRepository.findAllIds({
      syllabus: syllabusId,
      class: classId,
    });
    

    if(subjectVariants.length === 0){
        return []
    }

    const sort = buildFacultySort(sortValue)

    const data = await this._facultyRepository.findFacultyByClassAndSyllabus({
      subjectVariantIds: subjectVariants,
      page,
      limit,
      search,
      subjectId,
      sort,
    });

    return data;
  }
}
