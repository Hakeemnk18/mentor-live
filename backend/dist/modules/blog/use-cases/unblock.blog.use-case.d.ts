import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { IUnblockBlogUseCase } from "./interfaces/unblock.blog.use-case.interface.js";
export declare class UnblockBlogUseCase implements IUnblockBlogUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=unblock.blog.use-case.d.ts.map