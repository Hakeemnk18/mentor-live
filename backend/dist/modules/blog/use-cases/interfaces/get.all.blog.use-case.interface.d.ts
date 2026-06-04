import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { BlogListItem } from "../../type/blog.type.js";
export interface IGetAllBlogUseCase {
    execute(dto: GetAllQueryDto, role: "user" | "admin"): Promise<{
        data: BlogListItem[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.blog.use-case.interface.d.ts.map