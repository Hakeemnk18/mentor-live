import type { ChapterListQueryDto } from "../../dtos/get.chapter.dto.js";
export interface IGetChaptersForUserUseCase {
    execute(dto: ChapterListQueryDto): Promise<{
        id: string;
        name: string;
        price: number;
        icon: string;
    }[]>;
}
//# sourceMappingURL=get.all.for.user.use-case.interface.d.ts.map