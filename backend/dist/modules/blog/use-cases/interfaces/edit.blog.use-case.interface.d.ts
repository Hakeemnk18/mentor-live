import type { CreateBlogRequestDto } from "../../dto/create.blog.dto.js";
export interface IEditBlogUseCase {
    execute(id: string, dto: CreateBlogRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.blog.use-case.interface.d.ts.map