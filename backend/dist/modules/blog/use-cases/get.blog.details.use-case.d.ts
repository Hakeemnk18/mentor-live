import type { Blog } from "../entities/blog.entity.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { IGetBlogDetailsUseCase } from "./interfaces/get.blog.details.use-case.interface.js";
export declare class GetBlogDetailsUseCase implements IGetBlogDetailsUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(blogId: string): Promise<Blog | null>;
}
//# sourceMappingURL=get.blog.details.use-case.d.ts.map