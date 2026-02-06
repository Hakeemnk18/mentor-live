import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { IUnblockBlogUseCase } from "./interfaces/unblock.blog.use-case.interface.js";

@injectable()
export class UnblockBlogUseCase implements IUnblockBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository
  ) {}

  async execute(id: string): Promise<void> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(
        ResponseMessages.BLOG_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (!blog.isDeleted) {
      throw new CustomError(
        ResponseMessages.BLOG_NOT_DELETED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const restored = blog.restore();
    await this._blogRepository.save(restored);
  }
}
