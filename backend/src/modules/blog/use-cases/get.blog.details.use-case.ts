import { inject, injectable } from "tsyringe";
import type { Blog } from "../entities/blog.entity.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { IGetBlogDetailsUseCase } from "./interfaces/get.blog.details.use-case.interface.js";

@injectable()
export class GetBlogDetailsUseCase  implements IGetBlogDetailsUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository
  ) {}

  async execute(blogId: string): Promise<Blog | null> {
    const blog = await this._blogRepository.findById(blogId);
    return blog;
  }
}