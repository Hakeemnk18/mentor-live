import type { IFindFacultyByClassAndSyllabusUseCaseUseCase } from "./interfaces/find.faculty.by.class.and.syllabus.use-case.interface.js";
import type { GetAllFacultyBYClassAndSyllabusDto } from "../dtos/find.by.class.and.syllbus.dto.js";
import type { FacultyViewForUser } from "../types/faculty.type.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
export declare class FindFacultyByClassAndSyllabusUseCaseUseCase implements IFindFacultyByClassAndSyllabusUseCaseUseCase {
    private readonly _facultyRepository;
    private readonly _subjectVariantRepository;
    constructor(_facultyRepository: IFacultyRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(dto: GetAllFacultyBYClassAndSyllabusDto): Promise<FacultyViewForUser[]>;
}
//# sourceMappingURL=find.faculty.by.class.and.syllabus.use-case.d.ts.map