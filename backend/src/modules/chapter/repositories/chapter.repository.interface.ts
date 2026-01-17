import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { findAllWithFilters } from "../../../core/shared/type/find.all.with.filters.js";
import { Chapter } from "../entities/chapter.entity.js";

export interface IChapterRepository {
  create(chapterEntity: Chapter): Promise<Chapter>;
  findById(id: string): Promise<Chapter | null>;
  findByNameAndVariant(name: string, subjectVariant: string): Promise<Chapter | null>;
  save(chapterEntity: Chapter): Promise<Chapter>;
  findAllForAdmin(allDoc: IGetAllDocDB): Promise<Chapter[]>;
  findAllForUser(allDoc: findAllWithFilters): Promise<{ id: string; name: string; price: number; icon: string }[]>;
  countDocument(query: Record<string, any>): Promise<number>;
}
