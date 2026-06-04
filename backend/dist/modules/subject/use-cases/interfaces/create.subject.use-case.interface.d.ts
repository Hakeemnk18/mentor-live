import type { CreateSubjectRequestDto } from "../../dtos/subject.create.dto.js";
export interface ICreateSubjectUseCase {
    execute(dto: CreateSubjectRequestDto): Promise<void>;
}
//# sourceMappingURL=create.subject.use-case.interface.d.ts.map