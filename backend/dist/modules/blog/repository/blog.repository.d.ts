import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Blog } from "../entities/blog.entity.js";
import type { BlogListItem } from "../type/blog.type.js";
import type { IBlogRepository } from "./blog.repository.interface.js";
export declare class BlogRepository implements IBlogRepository {
    create(blogEntity: Blog): Promise<Blog>;
    findById(id: string): Promise<Blog | null>;
    findBySlug(slug: string): Promise<Blog | null>;
    save(blogEntity: Blog): Promise<Blog>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<BlogListItem[]>;
    findAllForUser(): Promise<Blog[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    getActivePriorities(excludeId?: string): Promise<number[]>;
}
//# sourceMappingURL=blog.repository.d.ts.map