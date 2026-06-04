import type { Request, Response } from "express";
import type { ICreateChapterUseCase } from "../use-cases/interfaces/create.chapter.use-case.interface.js";
import type { IEditChapterUseCase } from "../use-cases/interfaces/edit.chapter.use-case.interface.js";
import type { IGetChaptersForUserUseCase } from "../use-cases/interfaces/get.all.for.user.use-case.interface.js";
import type { IGetChaptersForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import type { IBlockChapterUseCase } from "../use-cases/interfaces/block.chapter.use-case.interface.js";
import type { IUnblockChapterUseCase } from "../use-cases/interfaces/unblock.chapter.use-case.interface.js";
import type { IChapterController } from "./interfaces/chapter.controller.interface.js";
import type { IGetChapterNameUseCase } from "../use-cases/interfaces/get.chapter.name.use-case.interface.js";
export declare class ChapterController implements IChapterController {
    private readonly _createChapterUseCase;
    private readonly _editChapterUseCase;
    private readonly _getChaptersForUserUseCase;
    private readonly _getChaptersForAdminUseCase;
    private readonly _blockChapterUseCase;
    private readonly _unblockChapterUseCase;
    private readonly _getChapterNameUseCase;
    constructor(_createChapterUseCase: ICreateChapterUseCase, _editChapterUseCase: IEditChapterUseCase, _getChaptersForUserUseCase: IGetChaptersForUserUseCase, _getChaptersForAdminUseCase: IGetChaptersForAdminUseCase, _blockChapterUseCase: IBlockChapterUseCase, _unblockChapterUseCase: IUnblockChapterUseCase, _getChapterNameUseCase: IGetChapterNameUseCase);
    /** 🏗️ Create chapter (Admin) */
    createChapter(req: Request, res: Response): Promise<void>;
    /** ✏️ Edit chapter (Admin) */
    editChapter(req: Request, res: Response): Promise<void>;
    /** 👤 User: get chapters for a subject variant */
    getChaptersForUser(req: Request, res: Response): Promise<void>;
    /** 🛠️ Admin: get all chapters (including deleted) */
    getChaptersForAdmin(req: Request, res: Response): Promise<void>;
    /** 🚫 Block (soft-delete) chapter */
    blockChapter(req: Request, res: Response): Promise<void>;
    /** ♻️ Unblock (restore) chapter */
    unblockChapter(req: Request, res: Response): Promise<void>;
    getChapterNameAndId(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=chapter.controller.d.ts.map