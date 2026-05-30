import { container } from "tsyringe";
import type { IAdminLoginUseCase } from "../modules/user/use-cases/interfaces/admin.login.use-case.interface.js";
import { AdminLoginUseCase } from "../modules/user/use-cases/admin.login.use-case.js";
import type { IUserRepository } from "../modules/user/repositories/user.repository.interface.js";
import { UserRepository } from "../modules/user/repositories/user.repository.js";
import type { IGetCurrentUserUseCase } from "../modules/user/use-cases/interfaces/get.current.user.use-case.interface.js";
import { GetCurrentUserUseCase } from "../modules/user/use-cases/get.current.user.use-case.js";
import type { IUserRefreshTokenUseCase } from "../modules/user/use-cases/interfaces/user.refresh.token.use-case.interface.js";
import { UserRefreshTokenUseCase } from "../modules/user/use-cases/user.refresh.token.use-case.js";
import type { ISendOtpUseCase } from "../modules/user/use-cases/interfaces/send.otp.use-case.interface.js";
import { SendOtpUseCase } from "../modules/user/use-cases/send.otp.use-case.js";
import type { IResendOtpUseCase } from "../modules/user/use-cases/interfaces/resend.otp.use-case.interface.js";
import { ResendOtpUseCase } from "../modules/user/use-cases/resend.otp.use-case.js";
import type { IVerifyOtpUseCase } from "../modules/user/use-cases/interfaces/verify.otp.use-case.interface.js";
import { VerifyOtpUseCase } from "../modules/user/use-cases/verify.otp.use-case.js";
import type { ICreateUserUseCase } from "../modules/user/use-cases/interfaces/create.user.use-case.interface.js";
import { CreateUserUseCase } from "../modules/user/use-cases/create.user.use-case.js";
import type { IEditUserUseCase } from "../modules/user/use-cases/interfaces/edit.user.use-case.interface.js";
import { EditUserUseCase } from "../modules/user/use-cases/edit.user.use-case.js";
import type { IBlockUserUseCase } from "../modules/user/use-cases/interfaces/block.user.use-case.interface.js";
import { BlockUserUseCase } from "../modules/user/use-cases/block.user.use-case.js";
import type { IUnblockUserUseCase } from "../modules/user/use-cases/interfaces/unblock.user.use-case.interface.js";
import { UnblockUserUseCase } from "../modules/user/use-cases/unblock.user.use-case.js";
import type { IGetAllUsersUseCase } from "../modules/user/use-cases/interfaces/get.all.users.use-case.interface.js";
import { GetAllUsersUseCase } from "../modules/user/use-cases/get.all.users.use-case.js";

export const registerUserDependencies = () => {
  container.register<IAdminLoginUseCase>("IAdminLoginUseCase", {
    useClass: AdminLoginUseCase,
  });
  container.register<IUserRepository>("IUserRepository", {
    useClass: UserRepository,
  });

  container.register<IGetCurrentUserUseCase>("IGetCurrentUserUseCase", {
    useClass: GetCurrentUserUseCase,
  });

  container.register<IUserRefreshTokenUseCase>("IUserRefreshTokenUseCase", {
    useClass: UserRefreshTokenUseCase,
  });

  container.register<ISendOtpUseCase>("ISendOtpUseCase", {
    useClass: SendOtpUseCase,
  });

  container.register<IResendOtpUseCase>("IResendOtpUseCase", {
    useClass: ResendOtpUseCase,
  });

  container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
    useClass: VerifyOtpUseCase,
  });

  container.register<ICreateUserUseCase>("ICreateUserUseCase", {
    useClass: CreateUserUseCase,
  });

  container.register<IEditUserUseCase>("IEditUserUseCase", {
    useClass: EditUserUseCase,
  });

  container.register<IBlockUserUseCase>("IBlockUserUseCase", {
    useClass: BlockUserUseCase,
  });

  container.register<IUnblockUserUseCase>("IUnblockUserUseCase", {
    useClass: UnblockUserUseCase,
  });

  container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
    useClass: GetAllUsersUseCase,
  });
};
