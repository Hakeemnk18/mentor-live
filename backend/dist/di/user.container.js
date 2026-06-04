import { container } from "tsyringe";
import { AdminLoginUseCase } from "../modules/user/use-cases/admin.login.use-case.js";
import { UserRepository } from "../modules/user/repositories/user.repository.js";
import { GetCurrentUserUseCase } from "../modules/user/use-cases/get.current.user.use-case.js";
import { UserRefreshTokenUseCase } from "../modules/user/use-cases/user.refresh.token.use-case.js";
import { SendOtpUseCase } from "../modules/user/use-cases/send.otp.use-case.js";
import { ResendOtpUseCase } from "../modules/user/use-cases/resend.otp.use-case.js";
import { VerifyOtpUseCase } from "../modules/user/use-cases/verify.otp.use-case.js";
import { CreateUserUseCase } from "../modules/user/use-cases/create.user.use-case.js";
import { EditUserUseCase } from "../modules/user/use-cases/edit.user.use-case.js";
import { BlockUserUseCase } from "../modules/user/use-cases/block.user.use-case.js";
import { UnblockUserUseCase } from "../modules/user/use-cases/unblock.user.use-case.js";
import { GetAllUsersUseCase } from "../modules/user/use-cases/get.all.users.use-case.js";
export const registerUserDependencies = () => {
    container.register("IAdminLoginUseCase", {
        useClass: AdminLoginUseCase,
    });
    container.register("IUserRepository", {
        useClass: UserRepository,
    });
    container.register("IGetCurrentUserUseCase", {
        useClass: GetCurrentUserUseCase,
    });
    container.register("IUserRefreshTokenUseCase", {
        useClass: UserRefreshTokenUseCase,
    });
    container.register("ISendOtpUseCase", {
        useClass: SendOtpUseCase,
    });
    container.register("IResendOtpUseCase", {
        useClass: ResendOtpUseCase,
    });
    container.register("IVerifyOtpUseCase", {
        useClass: VerifyOtpUseCase,
    });
    container.register("ICreateUserUseCase", {
        useClass: CreateUserUseCase,
    });
    container.register("IEditUserUseCase", {
        useClass: EditUserUseCase,
    });
    container.register("IBlockUserUseCase", {
        useClass: BlockUserUseCase,
    });
    container.register("IUnblockUserUseCase", {
        useClass: UnblockUserUseCase,
    });
    container.register("IGetAllUsersUseCase", {
        useClass: GetAllUsersUseCase,
    });
};
//# sourceMappingURL=user.container.js.map