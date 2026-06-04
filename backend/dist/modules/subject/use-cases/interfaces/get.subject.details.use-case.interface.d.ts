import type { SubjectDetailsView } from "../../type/subject.type.js";
export interface IGetSubjectDetailsUseCase {
    execute(subjectId: string): Promise<SubjectDetailsView>;
}
//# sourceMappingURL=get.subject.details.use-case.interface.d.ts.map