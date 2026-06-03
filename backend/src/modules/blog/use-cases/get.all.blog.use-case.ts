import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

import type { IGetAllBlogUseCase } from "./interfaces/get.all.blog.use-case.interface.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { BlogListItem } from "../type/blog.type.js";

@injectable()
export class GetAllBlogUseCase implements IGetAllBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository,
  ) {}

  async execute(
    dto: GetAllQueryDto,
    role: "user" | "admin",
  ): Promise<{ data: BlogListItem[]; total: number }> {
    const { page, search, limit, sortValue, filters } = dto;

    let query: Record<string, any> = {};
    let sort: Record<string, any> = { createdAt: -1 };

    if (role === "user") {
      query.isDeleted = false;
    }

    /* ---------- filters (isDeleted, isFeatured from parseReq) ---------- */
    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      }
    }

    /* ---------- sort ---------- */
    if (sortValue === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortValue === "newest") {
      sort = { createdAt: -1 };
    } else if (sortValue === "priority") {
      sort = { priority: 1, createdAt: -1 };
    } else if (sortValue === "featured") {
      sort = { isFeatured: -1, priority: 1, createdAt: -1 };
    }

    /* ---------- search (heading + author) ---------- */
    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { heading: { $regex: escaped, $options: "i" } },
        { author: { $regex: escaped, $options: "i" } },
        { topic: { $regex: escaped, $options: "i" } },
      ];
    }

    const allDoc: IGetAllDocDB = { page, limit, query, sort };

    const [data, total] = await Promise.all([
      this._blogRepository.findAllForAdmin(allDoc),
      this._blogRepository.countDocument(query),
    ]);

    return { data, total };
  }
}
