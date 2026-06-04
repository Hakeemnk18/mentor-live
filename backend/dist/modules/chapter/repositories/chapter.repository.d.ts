import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Chapter } from "../entities/chapter.entity.js";
import type { IChapterRepository } from "./chapter.repository.interface.js";
import type { ChapterListFilters } from "../type/chapter.type.js";
export declare class ChapterRepository implements IChapterRepository {
    create(chapterEntity: Chapter): Promise<Chapter>;
    findById(id: string): Promise<Chapter | null>;
    findByNameAndVariant(name: string, subjectVariant: string): Promise<Chapter | null>;
    save(chapterEntity: Chapter): Promise<Chapter>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Chapter[]>;
    findAllForUser(allDoc: ChapterListFilters): Promise<{
        id: string;
        name: string;
        price: number;
        icon: string;
    }[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    findAllNames(): Promise<{
        id: string;
        name: string;
    }[]>;
}
//# sourceMappingURL=chapter.repository.d.ts.map