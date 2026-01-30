import type { Blog } from "../../entities/blog.entity.js";

export interface IGetBlogDetailsUseCase {
  execute(blogId: string): Promise<Blog | null>;
}