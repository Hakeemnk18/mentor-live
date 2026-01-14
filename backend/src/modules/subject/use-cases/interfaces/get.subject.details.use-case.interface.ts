import type { SubjectDetailsView } from "../../type/subject.type.js";

export interface IGetSubjectDetailsUseCase {
  execute(subjectId: string): Promise<SubjectDetailsView>;
}
