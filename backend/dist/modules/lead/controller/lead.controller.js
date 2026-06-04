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
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import { CreateLeadSchema } from "../dto/create.lead.dto.js";
import { UpdateLeadStatusSchema } from "../dto/update.lead.status.dto.js";
let LeadController = class LeadController {
    _createLeadUseCase;
    _getAllLeadsUseCase;
    _updateLeadStatusUseCase;
    constructor(_createLeadUseCase, _getAllLeadsUseCase, _updateLeadStatusUseCase) {
        this._createLeadUseCase = _createLeadUseCase;
        this._getAllLeadsUseCase = _getAllLeadsUseCase;
        this._updateLeadStatusUseCase = _updateLeadStatusUseCase;
    }
    async createLead(req, res) {
        try {
            const dto = CreateLeadSchema.parse(req.body);
            await this._createLeadUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Your request has been submitted. We'll get in touch soon!",
            });
        }
        catch (error) {
            console.log("Error in createLead:", error);
            handleError(res, error);
        }
    }
    async getAllLeads(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["type", "status"]));
            const { data, total } = await this._getAllLeadsUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
                total,
                currentPage: dto.page,
                totalPages: Math.ceil(total / dto.limit),
            });
        }
        catch (error) {
            console.log("Error in getAllLeads:", error);
            handleError(res, error);
        }
    }
    async updateLeadStatus(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const { status } = UpdateLeadStatusSchema.parse(req.body);
            await this._updateLeadStatusUseCase.execute(id, status);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lead status updated",
            });
        }
        catch (error) {
            console.log("Error in updateLeadStatus:", error);
            handleError(res, error);
        }
    }
};
LeadController = __decorate([
    injectable(),
    __param(0, inject("ICreateLeadUseCase")),
    __param(1, inject("IGetAllLeadsUseCase")),
    __param(2, inject("IUpdateLeadStatusUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], LeadController);
export { LeadController };
//# sourceMappingURL=lead.controller.js.map