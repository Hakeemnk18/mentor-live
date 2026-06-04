import type { CreateChapterRequestDto } from "../../dtos/create.chapter.dto.js";
export interface IEditChapterUseCase {
    execute(id: string, dto: CreateChapterRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.chapter.use-case.interface.d.ts.map