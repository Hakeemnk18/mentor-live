import type { IEditBlogUseCase } from "./interfaces/edit.blog.use-case.interface.js";
import type { CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
export declare class EditBlogUseCase implements IEditBlogUseCase {
    private readonly _blogRepository;
    constructor(_blogRepository: IBlogRepository);
    execute(id: string, dto: CreateBlogRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.blog.use-case.d.ts.map