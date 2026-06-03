import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Blog } from "../entities/blog.entity.js";
import type { BlogListItem } from "../type/blog.type.js";

export interface IBlogRepository {
  create(blogEntity: Blog): Promise<Blog>;
  findById(id: string): Promise<Blog | null>;
  findBySlug(slug: string): Promise<Blog | null>;
  save(blogEntity: Blog): Promise<Blog>;

  findAllForAdmin(allDoc: IGetAllDocDB): Promise<BlogListItem[]>;
  findAllForUser(): Promise<Blog[]>;

  countDocument(query: Record<string, any>): Promise<number>;

  /** Returns all priorities already in use, optionally excluding one blog id */
  getActivePriorities(excludeId?: string): Promise<number[]>;
}
