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
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { cookieOptions, setAccessTokenCookie, setRefreshTokenCookie } from "../../../core/utils/auth.helpers.js";
import { VerifyOtpSchema } from "../dtos/otp.dto.js";
let AuthController = class AuthController {
    _getCurrentUserUseCase;
    _userRefreshTokenUseCase;
    _sendOtpUseCase;
    _resendOtpUseCase;
    _verifyOtpUseCase;
    constructor(_getCurrentUserUseCase, _userRefreshTokenUseCase, _sendOtpUseCase, _resendOtpUseCase, _verifyOtpUseCase) {
        this._getCurrentUserUseCase = _getCurrentUserUseCase;
        this._userRefreshTokenUseCase = _userRefreshTokenUseCase;
        this._sendOtpUseCase = _sendOtpUseCase;
        this._resendOtpUseCase = _resendOtpUseCase;
        this._verifyOtpUseCase = _verifyOtpUseCase;
    }
    async getCurrentUser(req, res) {
        try {
            const { user } = req;
            const userData = await this._getCurrentUserUseCase.execute(user.id);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.LOGIN_SUCCESS,
                data: userData,
                success: true,
            });
        }
        catch (error) {
            console.log("error in admin login", error);
            handleError(res, error);
        }
    }
    async logoutUserController(req, res) {
        try {
            res.cookie("access_token", "", {
                ...cookieOptions,
                maxAge: 0,
            });
            res.cookie("refresh_token", "", {
                ...cookieOptions,
                maxAge: 0,
            });
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.LOGOUT_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("error in user logout", error);
            handleError(res, error);
        }
    }
    async getRefreshToken(req, res) {
        try {
            console.log("inside get refresh controller");
            const refresh_token = req.cookies.refresh_token;
            //console.log("refresh token ",refresh_token)
            const { userData, accessToken, refreshToken } = await this._userRefreshTokenUseCase.execute(refresh_token);
            setAccessTokenCookie(res, accessToken);
            setRefreshTokenCookie(res, refreshToken);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.LOGIN_SUCCESS,
                data: userData,
                success: true,
            });
        }
        catch (error) {
            //console.log("error in user refresh token", error);
            handleError(res, error);
        }
    }
    async sendOtp(req, res) {
        try {
            const dto = VerifyOtpSchema.parse(req.body);
            await this._sendOtpUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.OTP_SENT_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("error in user send otp", error);
            handleError(res, error);
        }
    }
    async resendOtp(req, res) {
        try {
            const dto = VerifyOtpSchema.parse(req.body);
            await this._resendOtpUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.RESEND_OTP_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("error in user resend otp", error);
            handleError(res, error);
        }
    }
    async verifyOtp(req, res) {
        try {
            const dto = VerifyOtpSchema.parse(req.body);
            console.log(dto);
            await this._verifyOtpUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.OTP_VERIFICATION_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("error in user verify otp", error);
            handleError(res, error);
        }
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject('IGetCurrentUserUseCase')),
    __param(1, inject('IUserRefreshTokenUseCase')),
    __param(2, inject("ISendOtpUseCase")),
    __param(3, inject("IResendOtpUseCase")),
    __param(4, inject("IVerifyOtpUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map