import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

import type { IGetAllBlogUseCase } from "./interfaces/get.all.blog.use-case.interface.js";
import type { IBlogRepository } from "../repository/blog.repository.interface.js";
import type { Blog } from "../entities/blog.entity.js";
import type { BlogListItem } from "../type/blog.type.js";

@injectable()
export class GetAllBlogUseCase implements IGetAllBlogUseCase {
  constructor(
    @inject("IBlogRepository")
    private readonly _blogRepository: IBlogRepository
  ) {}

  async execute(
    dto: GetAllQueryDto,
    role: "user"| "admin"
  ): Promise<{ data: BlogListItem[]; total: number }> {
    const { page, search, limit, sortValue } = dto;

    let query: Record<string, any> = {};
    let sort: Record<string, any> = {
      createdAt: -1, 
    };

    if(role === "user") {
      query.isDeleted = false;
    }

    if (sortValue && sortValue.trim() !== "" && sortValue === "oldest") {
      sort = { createdAt: 1 };
    }else if (sortValue && sortValue.trim() !== "" && sortValue === "newest") {
      sort = { createdAt: -1 };
    }

    /* ---------- search (heading + author) ---------- */
    if (search && search.trim() !== "") {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { heading: { $regex: escapedSearch, $options: "i" } },
        { author: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const allDoc: IGetAllDocDB = {
      page,
      limit,
      query,
      sort,
    };

    const [data, total] = await Promise.all([
      this._blogRepository.findAllForAdmin(allDoc),
      this._blogRepository.countDocument(query),
    ]);

    return { data, total };
  }
}