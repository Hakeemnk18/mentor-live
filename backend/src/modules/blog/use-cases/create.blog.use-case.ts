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
    private readonly _blogRepository: IBlogRepository,
  ) {}

  async execute(dto: CreateBlogRequestDto): Promise<void> {
    /* ---------- slug generation + uniqueness ---------- */
    const slug = generateSlug(dto.heading);

    const existing = await this._blogRepository.findBySlug(slug);
    if (existing) {
      throw new CustomError(
        ResponseMessages.BLOG_SLUG_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ---------- priority uniqueness ---------- */
    if (dto.priority != null) {
      const taken = await this._blogRepository.getActivePriorities();
      if (taken.includes(dto.priority)) {
        throw new CustomError(
          "A blog with this priority already exists",
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* ---------- create ---------- */
    const blogEntity = new Blog({
      id: null,
      slug,
      author: dto.author,
      heading: dto.heading,
      description: dto.description,
      content: dto.content,
      image: dto.image ?? null,
      priority: dto.priority ?? null,
      topic: dto.topic ?? null,
      isFeatured: dto.isFeatured ?? false,
      isDeleted: false,
    });

    const blog = await this._blogRepository.create(blogEntity);

    if (!blog) {
      throw new CustomError(
        ResponseMessages.BLOG_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
