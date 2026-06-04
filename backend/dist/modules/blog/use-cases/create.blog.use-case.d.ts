import type { ICreateBlogUseCase } from "./interfaces/create.blog.use-case.interface.js";
import type { CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
export declare class CreateBlogUseCase implements ICreateBlogUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(dto: CreateBlogRequestDto): Promise<void>;
}
//# sourceMappingURL=create.blog.use-case.d.ts.map