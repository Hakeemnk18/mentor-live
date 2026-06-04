import type { CreateBlogRequestDto } from "../../dto/create.blog.dto.js";
export interface ICreateBlogUseCase {
    execute(dto: CreateBlogRequestDto): Promise<void>;
}
//# sourceMappingURL=create.blog.use-case.interface.d.ts.map