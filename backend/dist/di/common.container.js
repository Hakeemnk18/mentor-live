import { container } from "tsyringe";
import { BcryptService } from "../infrastructure/services/bcrypt.service.js";
import { JwtService } from "../infrastructure/services/jwt.service.js";
import { IOtpService } from "../core/ports/otp.service.interface.js";
import { OtpService } from "../infrastructure/services/otp.service.js";
import { PhoneVerificationRepository } from "../modules/phone-verification/repository/phone.verification.repository.js";
import { WhatsAppNotificationService } from "../infrastructure/services/notification.service.js";
export const registerCommonDependencies = () => {
    container.register("IHashingService", {
        useClass: BcryptService,
    });
    container.register("ITokenService", { useClass: JwtService });
    container.register("IOtpService", {
        useClass: OtpService
    });
    container.register("IPhoneVerificationRepository", {
        useClass: PhoneVerificationRepository
    });
    container.register("INotificationService", {
        useClass: WhatsAppNotificationService
    });
    // container.register<IRandomTokenService>("IRandomTokenService", {
    // useClass: RandomTokenService,
    // });
    // Auth middleware (shared)
    // container.register<IAuthenticate>("IAuthenticate", { useClass: Authenticate });
};
//# sourceMappingURL=common.container.js.map