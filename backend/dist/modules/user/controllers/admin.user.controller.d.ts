import type { Request, Response } from "express";
import type { IAdminUserController } from "./interfaces/admin.user.controller.interface.js";
import type { ICreateUserUseCase } from "../use-cases/interfaces/create.user.use-case.interface.js";
import type { IEditUserUseCase } from "../use-cases/interfaces/edit.user.use-case.interface.js";
import type { IBlockUserUseCase } from "../use-cases/interfaces/block.user.use-case.interface.js";
import type { IUnblockUserUseCase } from "../use-cases/interfaces/unblock.user.use-case.interface.js";
import type { IGetAllUsersUseCase } from "../use-cases/interfaces/get.all.users.use-case.interface.js";
export declare class AdminUserController implements IAdminUserController {
    private readonly _createUserUseCase;
    private readonly _editUserUseCase;
    private readonly _blockUserUseCase;
    private readonly _unblockUserUseCase;
    private readonly _getAllUsersUseCase;
    constructor(_createUserUseCase: ICreateUserUseCase, _editUserUseCase: IEditUserUseCase, _blockUserUseCase: IBlockUserUseCase, _unblockUserUseCase: IUnblockUserUseCase, _getAllUsersUseCase: IGetAllUsersUseCase);
    createUser(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    editUser(req: Request, res: Response): Promise<void>;
    blockUser(req: Request, res: Response): Promise<void>;
    unblockUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=admin.user.controller.d.ts.map