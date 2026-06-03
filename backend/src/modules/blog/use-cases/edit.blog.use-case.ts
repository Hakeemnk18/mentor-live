import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Blog } from "../entities/blog.entity.js";
import type { IEditBlogUseCase } from "./interfaces/edit.blog.use-case.interface.js";
import type { CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import { deleteCloudinaryImage } from "../../../core/utils/delete.cloudinary.image.js";

@injectable()
export class EditBlogUseCase implements IEditBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository,
  ) {}

  async execute(id: string, dto: CreateBlogRequestDto): Promise<void> {
    const existing = await this._blogRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.BLOG_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /* ---------- priority uniqueness (exclude self) ---------- */
    if (dto.priority != null && dto.priority !== existing.priority) {
      const taken = await this._blogRepository.getActivePriorities(id);
      if (taken.includes(dto.priority)) {
        throw new CustomError(
          "A blog with this priority already exists",
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* ---------- persist ---------- */
    const updated = new Blog({
      id: existing.id,
      slug: existing.slug,           // slug never changes on edit
      author: dto.author,
      heading: dto.heading,
      description: dto.description,
      content: dto.content,
      image: dto.image !== undefined ? (dto.image ?? null) : existing.image,
      priority: dto.priority !== undefined ? (dto.priority ?? null) : existing.priority,
      topic: dto.topic !== undefined ? (dto.topic ?? null) : existing.topic,
      isFeatured: dto.isFeatured ?? existing.isFeatured,
      isDeleted: existing.isDeleted,
    });

    await this._blogRepository.save(updated);

    /* ---------- delete old Cloudinary image if replaced ---------- */
    const oldPublicId = existing.image?.publicId;
    const newPublicId = updated.image?.publicId;

    if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
      try {
        await deleteCloudinaryImage(oldPublicId);
      } catch {
        /* non-fatal — log and continue */
        console.warn(`Failed to delete old blog image from Cloudinary: ${oldPublicId}`);
      }
    }

    /* ---------- if image was removed entirely, delete from Cloudinary ---------- */
    if (oldPublicId && !newPublicId) {
      try {
        await deleteCloudinaryImage(oldPublicId);
      } catch {
        console.warn(`Failed to delete removed blog image from Cloudinary: ${oldPublicId}`);
      }
    }
  }
}
