import { Blog } from "../entities/blog.entity.js";
import type { BlogListItem } from "../type/blog.type.js";
export declare class BlogMapper {
    static toDomain(blogModelData: any): Blog | null;
    static toPersistence(blogEntity: Blog): any;
    static toListItem(doc: any): BlogListItem;
}
//# sourceMappingURL=blog.mapper.d.ts.map