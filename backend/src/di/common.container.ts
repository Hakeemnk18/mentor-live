import { container } from "tsyringe";
import type { IHashingService } from "../core/ports/hashing.service.interface.js";
import { BcryptService } from "../infrastructure/services/bcrypt.service.js";
import type { ITokenService } from "../core/ports/token.service.interface.js";
import { JwtService } from "../infrastructure/services/jwt.service.js";
import { IOtpService } from "../core/ports/otp.service.interface.js";
import { OtpService } from "../infrastructure/services/otp.service.js";
import type { IPhoneVerificationRepository } from "../modules/phone-verification/repository/phone.verification.repository.interface.js";
import { PhoneVerificationRepository } from "../modules/phone-verification/repository/phone.verification.repository.js";
import type { INotificationService } from "../core/ports/notification.service.interface.js";
import { WhatsAppNotificationService } from "../infrastructure/services/notification.service.js";



export const registerCommonDependencies = () => {
container.register<IHashingService>("IHashingService", {
useClass: BcryptService,
});


container.register<ITokenService>("ITokenService", { useClass: JwtService });

container.register<IOtpService>("IOtpService", {
    useClass: OtpService
})

container.register<IPhoneVerificationRepository>("IPhoneVerificationRepository", {
    useClass: PhoneVerificationRepository
})

container.register<INotificationService>("INotificationService", {
    useClass: WhatsAppNotificationService
})

// container.register<IRandomTokenService>("IRandomTokenService", {
// useClass: RandomTokenService,
// });

// Auth middleware (shared)
// container.register<IAuthenticate>("IAuthenticate", { useClass: Authenticate });
 };