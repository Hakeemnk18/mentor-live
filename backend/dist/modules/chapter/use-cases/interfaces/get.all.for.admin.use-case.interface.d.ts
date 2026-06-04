import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { ChapterWithSubjectVariantView } from "../../type/chapter.type.js";
export interface IGetChaptersForAdminUseCase {
    execute(dto: GetAllQueryDto): Promise<{
        data: ChapterWithSubjectVariantView[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.interface.d.ts.map