import type { CreateBlogRequestDto } from "../../dto/create.blog.dto.js";

export interface IEditBlogUseCase {
  execute(id: string, dto: CreateBlogRequestDto): Promise<void>;
}