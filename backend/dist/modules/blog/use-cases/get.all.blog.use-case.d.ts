import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllBlogUseCase } from "./interfaces/get.all.blog.use-case.interface.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { BlogListItem } from "../type/blog.type.js";
export declare class GetAllBlogUseCase implements IGetAllBlogUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(dto: GetAllQueryDto, role: "user" | "admin"): Promise<{
        data: BlogListItem[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.blog.use-case.d.ts.map