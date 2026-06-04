var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { User } from "../entities/user.entity.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
let CreateUserUseCase = class CreateUserUseCase {
    _userRepository;
    _hashingService;
    constructor(_userRepository, _hashingService) {
        this._userRepository = _userRepository;
        this._hashingService = _hashingService;
    }
    async execute(dto) {
        const existing = await this._userRepository.findByEmail(dto.email);
        if (existing) {
            throw new CustomError(ResponseMessages.EMAIL_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
        }
        const hashedPassword = await this._hashingService.hash(dto.password);
        const user = new User({
            id: null,
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            tokenVersion: 0,
            isVerified: true,
            isBlocked: false,
        });
        return await this._userRepository.create(user);
    }
};
CreateUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IUserRepository")),
    __param(1, inject("IHashingService")),
    __metadata("design:paramtypes", [Object, Function])
], CreateUserUseCase);
export { CreateUserUseCase };
//# sourceMappingURL=create.user.use-case.js.map