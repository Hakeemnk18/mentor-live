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
import { CustomError, handleError } from "../../../core/errors/custom.error.js";
import { CreateFacultySchema, } from "../dtos/create.faculty.dto.js";
import { FindByClassSyllabusQuerySchema } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import { parseListQuery } from "../../../core/utils/parse.list.query.helper.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { EditFacultySchema } from "../dtos/edit.faculty.dto.js";
import { AddSlotSchema } from "../dtos/add.slot.dto.js";
import { AddChapterSlotSchema } from "../dtos/add.chapter.dto.js";
import { FindFacultyByChapterUseCase } from "../use-cases/find.faculty.by.chapter.use-case.js";
import { GetAllFacultyBYClassAndSyllabusSchema } from "../dtos/find.by.class.and.syllbus.dto.js";
import { GetAllFacultyBYChapterSchema } from "../dtos/find.by.chapter.dto.js";
import { parseChapterQuery } from "../utils/parse.chapter.request.qury.js";
import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { availabilitySchema } from "../../../core/utils/validate.is-availble.js";
import { log } from "console";
let FacultyController = class FacultyController {
    _createFacultyUseCase;
    _getAllFacultyForAdminUseCase;
    _getFacultyDetailsForAdminUseCase;
    _editFacultyUseCase;
    _facultyAddSlotUseCase;
    _facultyAddChapterSlotUseCase;
    _findFacultyByChapterUseCase;
    _findFacultyByClassAndSyllabusUseCaseUseCase;
    _getFacultyDetailsByChapterUseCase;
    _getFacultyDetailsBySlotUseCase;
    _setFacultySlotAvailabilityUseCase;
    _blockFacultyUseCase;
    _unblockFacultyUseCase;
    _getAvailableSlotsUseCase;
    _getUserSlotDetailsUseCase;
    constructor(_createFacultyUseCase, _getAllFacultyForAdminUseCase, _getFacultyDetailsForAdminUseCase, _editFacultyUseCase, _facultyAddSlotUseCase, _facultyAddChapterSlotUseCase, _findFacultyByChapterUseCase, _findFacultyByClassAndSyllabusUseCaseUseCase, _getFacultyDetailsByChapterUseCase, _getFacultyDetailsBySlotUseCase, _setFacultySlotAvailabilityUseCase, _blockFacultyUseCase, _unblockFacultyUseCase, _getAvailableSlotsUseCase, _getUserSlotDetailsUseCase) {
        this._createFacultyUseCase = _createFacultyUseCase;
        this._getAllFacultyForAdminUseCase = _getAllFacultyForAdminUseCase;
        this._getFacultyDetailsForAdminUseCase = _getFacultyDetailsForAdminUseCase;
        this._editFacultyUseCase = _editFacultyUseCase;
        this._facultyAddSlotUseCase = _facultyAddSlotUseCase;
        this._facultyAddChapterSlotUseCase = _facultyAddChapterSlotUseCase;
        this._findFacultyByChapterUseCase = _findFacultyByChapterUseCase;
        this._findFacultyByClassAndSyllabusUseCaseUseCase = _findFacultyByClassAndSyllabusUseCaseUseCase;
        this._getFacultyDetailsByChapterUseCase = _getFacultyDetailsByChapterUseCase;
        this._getFacultyDetailsBySlotUseCase = _getFacultyDetailsBySlotUseCase;
        this._setFacultySlotAvailabilityUseCase = _setFacultySlotAvailabilityUseCase;
        this._blockFacultyUseCase = _blockFacultyUseCase;
        this._unblockFacultyUseCase = _unblockFacultyUseCase;
        this._getAvailableSlotsUseCase = _getAvailableSlotsUseCase;
        this._getUserSlotDetailsUseCase = _getUserSlotDetailsUseCase;
    }
    async createFaculty(req, res) {
        try {
            const dto = CreateFacultySchema.parse(req.body);
            await this._createFacultyUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.FACULTY_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createFaculty:", error);
            handleError(res, error);
        }
    }
    async GetAllFacultyForAdmin(req, res) {
        try {
            const dto = FindByClassSyllabusQuerySchema.parse(parseListQuery(req));
            const { data, total } = await this._getAllFacultyForAdminUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
                total: total,
            });
        }
        catch (error) {
            console.log("Error in get all faculty for admin:", error);
            handleError(res, error);
        }
    }
    async getFacultyDetailsForAdmin(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            const facultyDetails = await this._getFacultyDetailsForAdminUseCase.execute(facultyId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: facultyDetails,
            });
        }
        catch (error) {
            console.log("Error in get faculty details for admin:", error);
            handleError(res, error);
        }
    }
    async editFaculty(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            const dto = EditFacultySchema.parse(req.body);
            await this._editFacultyUseCase.execute(facultyId, dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.FACULTY_UPDATED,
                success: true,
            });
        }
        catch (error) {
            console.log("Error in Edit faculty  for admin:", error);
            handleError(res, error);
        }
    }
    async facultyAddSlots(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            const dto = AddSlotSchema.parse(req.body);
            await this._facultyAddSlotUseCase.execute(facultyId, dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SLOT_ADDED_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("Error in  add faculty slot", error);
            handleError(res, error);
        }
    }
    async facultyAddChapterSlots(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            const dto = AddChapterSlotSchema.parse(req.body);
            await this._facultyAddChapterSlotUseCase.execute(facultyId, dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SLOT_ADDED_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            console.log("Error in  add faculty chapter slot", error);
            handleError(res, error);
        }
    }
    async findAllFacultyForUser(req, res) {
        try {
            const type = req.query.type;
            if (type !== "class" && type !== "chapter") {
                throw new CustomError(ResponseMessages.INVALID_FACULTY_LIST_TYPE, HttpStatusCode.BAD_REQUEST);
            }
            let data;
            if (type === "class") {
                const dto = GetAllFacultyBYClassAndSyllabusSchema.parse(parseListQuery(req));
                data =
                    await this._findFacultyByClassAndSyllabusUseCaseUseCase.execute(dto);
            }
            else if (type === "chapter") {
                const dto = GetAllFacultyBYChapterSchema.parse(parseChapterQuery(req));
                data = await this._findFacultyByChapterUseCase.execute(dto);
            }
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
            });
        }
        catch (error) {
            console.log("Error in  find faculty for user", error);
            handleError(res, error);
        }
    }
    async getFacultyDetailsByChapter(req, res) {
        try {
            validateObjectId(req.params.id);
            const facultyId = req.params.id;
            const chapterId = ObjectIdSchema.parse(req.query.chapterId);
            const data = await this._getFacultyDetailsByChapterUseCase.execute(facultyId, chapterId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
            });
        }
        catch (error) {
            console.log("Error in  get faculty details by chapter", error);
            handleError(res, error);
        }
    }
    async getFacultyDetailsBySlot(req, res) {
        try {
            validateObjectId(req.params.id);
            const facultyId = req.params.id;
            const variantId = req.query.variantId;
            const data = await this._getFacultyDetailsBySlotUseCase.execute(facultyId, variantId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
            });
        }
        catch (error) {
            console.log("Error in  get faculty details by slot", error);
            handleError(res, error);
        }
    }
    async updateSlotAvailability(req, res) {
        try {
            const { facultyId, slotId } = req.params;
            validateObjectId(facultyId);
            validateObjectId(slotId);
            const { isAvailable } = availabilitySchema.parse(req.body);
            const validFacultyId = facultyId;
            const validSlotId = slotId;
            await this._setFacultySlotAvailabilityUseCase.execute({
                facultyId: validFacultyId,
                mode: "slot",
                slotId: validSlotId,
                isAvailable,
            });
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async updateChapterSlotAvailability(req, res) {
        try {
            const { facultyId, chapterId } = req.params;
            validateObjectId(facultyId);
            validateObjectId(chapterId);
            const { isAvailable } = availabilitySchema.parse(req.body);
            const validFacultyId = facultyId;
            const validChapterId = chapterId;
            await this._setFacultySlotAvailabilityUseCase.execute({
                facultyId: validFacultyId,
                mode: "chapter",
                chapterId: validChapterId,
                isAvailable,
            });
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async blockFaculty(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            await this._blockFacultyUseCase.execute(facultyId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.FACULTY_BLOCKED,
                success: true,
            });
        }
        catch (error) {
            console.log("Error in blocking faculty:", error);
            handleError(res, error);
        }
    }
    async unblockFaculty(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            await this._unblockFacultyUseCase.execute(facultyId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.FACULTY_UNBLOCKED,
                success: true,
            });
        }
        catch (error) {
            console.log("Error in unblocking faculty:", error);
            handleError(res, error);
        }
    }
    async getAvailableSlots(req, res) {
        try {
            const facultyId = req.params.id;
            validateObjectId(facultyId);
            const availableSlots = await this._getAvailableSlotsUseCase.execute(facultyId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: availableSlots,
            });
        }
        catch (error) {
            console.log("Error in getting available slots:", error);
            handleError(res, error);
        }
    }
    async getUserSlotDetails(req, res) {
        try {
            validateObjectId(req.params.id);
            const facultyId = req.params.id;
            const slotId = ObjectIdSchema.parse(req.query.slotId);
            const slotDetails = await this._getUserSlotDetailsUseCase.execute(facultyId, slotId);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: slotDetails,
            });
        }
        catch (error) {
            console.log("Error in getting user slot details:", error);
            handleError(res, error);
        }
    }
};
FacultyController = __decorate([
    injectable(),
    __param(0, inject("ICreateFacultyUseCase")),
    __param(1, inject("IGetAllFacultyForAdminUseCase")),
    __param(2, inject("IGetFacultyDetailsUseCase")),
    __param(3, inject("IEditFacultyUseCase")),
    __param(4, inject("IFacultyAddSlotUseCase")),
    __param(5, inject("IFacultyAddChapterSlotUseCase")),
    __param(6, inject("IFindFacultyByChapterUseCase")),
    __param(7, inject("IFindFacultyByClassAndSyllabusUseCaseUseCase")),
    __param(8, inject("IGetFacultyDetailsByChapterUseCase")),
    __param(9, inject("IGetFacultyDetailsBySlotUseCase")),
    __param(10, inject("ISetFacultySlotAvailabilityUseCase")),
    __param(11, inject("IBlockFacultyUseCase")),
    __param(12, inject("IUnblockFacultyUseCase")),
    __param(13, inject("IGetAvailableSlotsUseCase")),
    __param(14, inject("IGetUserSlotDetailsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], FacultyController);
export { FacultyController };
//# sourceMappingURL=faculty.controller.js.map