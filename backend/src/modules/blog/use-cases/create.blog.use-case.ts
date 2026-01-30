import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Blog } from "../entities/blog.entity.js";
import type { ICreateBlogUseCase } from "./interfaces/create.blog.use-case.interface.js";
import type { CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import { generateSlug } from "../utils/slug.create.helper.js";

@injectable()
export class CreateBlogUseCase implements ICreateBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository
  ) {}

  async execute(dto: CreateBlogRequestDto): Promise<void> {
    
    /* ---------- slug generation ---------- */
    const slug = generateSlug(dto.heading);

    /* ---------- slug uniqueness check ---------- */
    const existing = await this._blogRepository.findBySlug(slug);

    if (existing) {
      throw new CustomError(
        ResponseMessages.BLOG_SLUG_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    /* ---------- create blog entity ---------- */
    const blogEntity = new Blog({
      id: null,
      slug,
      author: dto.author,
      heading: dto.heading,
      description: dto.description,
      content: dto.content,
      isDeleted: false,
    });

    const blog = await this._blogRepository.create(blogEntity);

    if (!blog) {
      throw new CustomError(
        ResponseMessages.BLOG_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  /* ---------- private helpers ---------- */
  
}
