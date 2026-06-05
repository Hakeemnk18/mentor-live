import type { ChapterWithSubjectVariantView } from "../../type/chapter.type.js";

export interface IGetChapterByIdForAdminUseCase {
  execute(id: string): Promise<ChapterWithSubjectVariantView>;
}
