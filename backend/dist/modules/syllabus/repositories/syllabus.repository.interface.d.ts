import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Syllabus } from "../entities/syllabus.entity.js";
export interface ISyllabusRepository {
    create(syllabusEntity: Syllabus): Promise<Syllabus>;
    findById(id: string): Promise<Syllabus | null>;
    findByName(name: string): Promise<Syllabus | null>;
    save(syllabusEntity: Syllabus): Promise<Syllabus>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Syllabus[]>;
    findAllForUser(): Promise<{
        id: string;
        name: string;
    }[]>;
    countDocument(query: Record<string, any>): Promise<number>;
}
//# sourceMappingURL=syllabus.repository.interface.d.ts.map