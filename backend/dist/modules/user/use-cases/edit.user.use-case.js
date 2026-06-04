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
let EditUserUseCase = class EditUserUseCase {
    _userRepository;
    _hashingService;
    constructor(_userRepository, _hashingService) {
        this._userRepository = _userRepository;
        this._hashingService = _hashingService;
    }
    async execute(id, dto) {
        const user = await this._userRepository.findById(id);
        if (!user) {
            throw new CustomError(ResponseMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this._userRepository.findByEmail(dto.email);
            if (existing) {
                throw new CustomError(ResponseMessages.EMAIL_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
            }
        }
        let password = user.password;
        if (dto.password) {
            password = await this._hashingService.hash(dto.password);
        }
        const updated = new User({
            id: user.id,
            name: dto.name ?? user.name,
            email: dto.email ?? user.email,
            password,
            role: dto.role ?? user.role,
            tokenVersion: user.tokenVersion,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            googleId: user.googleId,
        });
        return await this._userRepository.save(updated);
    }
};
EditUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IUserRepository")),
    __param(1, inject("IHashingService")),
    __metadata("design:paramtypes", [Object, Function])
], EditUserUseCase);
export { EditUserUseCase };
//# sourceMappingURL=edit.user.use-case.js.map