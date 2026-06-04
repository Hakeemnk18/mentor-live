import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { IBlockBlogUseCase } from "./interfaces/block.blog.use-case.interface.js";
export declare class BlockBlogUseCase implements IBlockBlogUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=block.blog.use-case.d.ts.map