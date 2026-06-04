import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IGetChaptersForAdminUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { ChapterWithSubjectVariantView } from "../type/chapter.type.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
export declare class GetChaptersForAdminUseCase implements IGetChaptersForAdminUseCase {
    private readonly _chapterRepository;
    private readonly _subjectVariantRepository;
    constructor(_chapterRepository: IChapterRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: ChapterWithSubjectVariantView[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.d.ts.map