import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";

import type { IBlogController } from "./interfaces/blog.controller.interface.js";
import type { ICreateBlogUseCase } from "../use-cases/interfaces/create.blog.use-case.interface.js";
import type { IEditBlogUseCase } from "../use-cases/interfaces/edit.blog.use-case.interface.js";
import type { IBlockBlogUseCase } from "../use-cases/interfaces/block.blog.use-case.interface.js";
import type { IUnblockBlogUseCase } from "../use-cases/interfaces/unblock.blog.use-case.interface.js";
import type { IGetAllBlogUseCase } from "../use-cases/interfaces/get.all.blog.use-case.interface.js";
import type { IGetBlogDetailsUseCase } from "../use-cases/interfaces/get.blog.details.use-case.interface.js";

import { CreateBlogSchema, type CreateBlogRequestDto } from "../dto/create.blog.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";

@injectable()
export class BlogController implements IBlogController {
  constructor(
    @inject("ICreateBlogUseCase")
    private readonly _createBlogUseCase: ICreateBlogUseCase,

    @inject("IEditBlogUseCase")
    private readonly _editBlogUseCase: IEditBlogUseCase,

    @inject("IBlockBlogUseCase")
    private readonly _blockBlogUseCase: IBlockBlogUseCase,

    @inject("IUnblockBlogUseCase")
    private readonly _unblockBlogUseCase: IUnblockBlogUseCase,

    @inject("IGetAllBlogUseCase")
    private readonly _getAllBlogUseCase: IGetAllBlogUseCase,

    @inject("IGetBlogDetailsUseCase")
    private readonly _getBlogDetailsUseCase: IGetBlogDetailsUseCase,
  ) {}

  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateBlogRequestDto = CreateBlogSchema.parse(req.body);
      await this._createBlogUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.BLOG_CREATED,
      });
    } catch (error) {
      console.log("Error in createBlog:", error);
      handleError(res, error);
    }
  }

  async editBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const dto: CreateBlogRequestDto = CreateBlogSchema.parse(req.body);
      await this._editBlogUseCase.execute(id!, dto);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BLOG_UPDATED,
      });
    } catch (error) {
      console.log("Error in editBlog:", error);
      handleError(res, error);
    }
  }

  async blockBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._blockBlogUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BLOG_DELETED,
      });
    } catch (error) {
      console.log("Error in blockBlog:", error);
      handleError(res, error);
    }
  }

  async unblockBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._unblockBlogUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BLOG_UPDATED,
      });
    } catch (error) {
      console.log("Error in unblockBlog:", error);
      handleError(res, error);
    }
  }

  async getAllBlogForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["isDeleted", "isFeatured"]),
      );
      const { data, total } = await this._getAllBlogUseCase.execute(dto, "admin");
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getAllBlogForAdmin:", error);
      handleError(res, error);
    }
  }

  async getAllBlogForUser(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["isFeatured"]),
      );
      const { data, total } = await this._getAllBlogUseCase.execute(dto, "user");
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
        /* keep legacy field so existing consumers don't break */
        totalPage: total,
      });
    } catch (error) {
      console.log("Error in getAllBlogForUser:", error);
      handleError(res, error);
    }
  }

  async getFullBlogDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const blog = await this._getBlogDetailsUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: blog,
      });
    } catch (error) {
      console.log("Error in getFullBlogDetails:", error);
      handleError(res, error);
    }
  }
}
