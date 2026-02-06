import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Blog } from "../entities/blog.entity.js";
import type { IEditBlogUseCase } from "./interfaces/edit.blog.use-case.interface.js";
import type { CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";

@injectable()
export class EditBlogUseCase implements IEditBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository
  ) {}

  async execute(
    id: string,
    dto: CreateBlogRequestDto
  ): Promise<void> {
    //  Fetch existing blog
    const existing = await this._blogRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.BLOG_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Rebuild domain entity (immutable update)
    //  ⚠️ slug is intentionally preserved
    
    const updated = new Blog({
      id: existing.id,
      slug: existing.slug,
      author: dto.author,
      heading: dto.heading,
      description: dto.description,
      content: dto.content,
      isDeleted: existing.isDeleted,
    });

    //  Persist
    await this._blogRepository.save(updated);
  }
}
