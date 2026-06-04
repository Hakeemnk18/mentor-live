import type { Request, Response } from "express";
import type { IBlogController } from "./interfaces/blog.controller.interface.js";
import type { ICreateBlogUseCase } from "../use-cases/interfaces/create.blog.use-case.interface.js";
import type { IEditBlogUseCase } from "../use-cases/interfaces/edit.blog.use-case.interface.js";
import type { IBlockBlogUseCase } from "../use-cases/interfaces/block.blog.use-case.interface.js";
import type { IUnblockBlogUseCase } from "../use-cases/interfaces/unblock.blog.use-case.interface.js";
import type { IGetAllBlogUseCase } from "../use-cases/interfaces/get.all.blog.use-case.interface.js";
import type { IGetBlogDetailsUseCase } from "../use-cases/interfaces/get.blog.details.use-case.interface.js";
export declare class BlogController implements IBlogController {
    private readonly _createBlogUseCase;
    private readonly _editBlogUseCase;
    private readonly _blockBlogUseCase;
    private readonly _unblockBlogUseCase;
    private readonly _getAllBlogUseCase;
    private readonly _getBlogDetailsUseCase;
    constructor(_createBlogUseCase: ICreateBlogUseCase, _editBlogUseCase: IEditBlogUseCase, _blockBlogUseCase: IBlockBlogUseCase, _unblockBlogUseCase: IUnblockBlogUseCase, _getAllBlogUseCase: IGetAllBlogUseCase, _getBlogDetailsUseCase: IGetBlogDetailsUseCase);
    createBlog(req: Request, res: Response): Promise<void>;
    editBlog(req: Request, res: Response): Promise<void>;
    blockBlog(req: Request, res: Response): Promise<void>;
    unblockBlog(req: Request, res: Response): Promise<void>;
    getAllBlogForAdmin(req: Request, res: Response): Promise<void>;
    getAllBlogForUser(req: Request, res: Response): Promise<void>;
    getFullBlogDetails(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=blog.controller.d.ts.map