import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IAdminUserController } from "./interfaces/admin.user.controller.interface.js";
import type { ICreateUserUseCase } from "../use-cases/interfaces/create.user.use-case.interface.js";
import type { IEditUserUseCase } from "../use-cases/interfaces/edit.user.use-case.interface.js";
import type { IBlockUserUseCase } from "../use-cases/interfaces/block.user.use-case.interface.js";
import type { IUnblockUserUseCase } from "../use-cases/interfaces/unblock.user.use-case.interface.js";
import type { IGetAllUsersUseCase } from "../use-cases/interfaces/get.all.users.use-case.interface.js";
import { CreateUserSchema } from "../dtos/create.user.dto.js";
import { EditUserSchema } from "../dtos/edit.user.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";

@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(
    @inject("ICreateUserUseCase")
    private readonly _createUserUseCase: ICreateUserUseCase,

    @inject("IEditUserUseCase")
    private readonly _editUserUseCase: IEditUserUseCase,

    @inject("IBlockUserUseCase")
    private readonly _blockUserUseCase: IBlockUserUseCase,

    @inject("IUnblockUserUseCase")
    private readonly _unblockUserUseCase: IUnblockUserUseCase,

    @inject("IGetAllUsersUseCase")
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateUserSchema.parse(req.body);
      const user = await this._createUserUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.USER_CREATED,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.log("Error in createUser:", error);
      handleError(res, error);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["isBlocked", "role"]),
      );
      const { data: users, total } = await this._getAllUsersUseCase.execute(dto);
      const data = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isBlocked: u.isBlocked,
        isVerified: u.isVerified,
      }));
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getAllUsers:", error);
      handleError(res, error);
    }
  }

  async editUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const dto = EditUserSchema.parse(req.body);
      const user = await this._editUserUseCase.execute(id!, dto);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.USER_UPDATED,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.log("Error in editUser:", error);
      handleError(res, error);
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._blockUserUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.USER_BLOCKED,
      });
    } catch (error) {
      console.log("Error in blockUser:", error);
      handleError(res, error);
    }
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._unblockUserUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.USER_UNBLOCKED,
      });
    } catch (error) {
      console.log("Error in unblockUser:", error);
      handleError(res, error);
    }
  }
}
