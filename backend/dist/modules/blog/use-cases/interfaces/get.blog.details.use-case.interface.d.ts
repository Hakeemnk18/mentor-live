import type { Blog } from "../../entities/blog.entity.js";
export interface IGetBlogDetailsUseCase {
    execute(blogId: string): Promise<Blog | null>;
}
//# sourceMappingURL=get.blog.details.use-case.interface.d.ts.map