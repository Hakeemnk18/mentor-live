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
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { Types } from "mongoose";
import { Booking } from "../entities/booking.entity.js";
import { Student } from "../../student/entities/student.entity.js";
import { validateBookingModeInvariant } from "../utils/booking.invariant.js";
import { validateSlotForBooking } from "../utils/slot.pool.invariant.js";
import { validateChapterSlotForBooking } from "../utils/chapter.slot.pool.invariant.js";
const { ObjectId } = Types;
let CreateBookingUseCase = class CreateBookingUseCase {
    _bookingRepository;
    _facultyRepository;
    _chapterRepository;
    _studentRepository;
    _subjectVariantRepository;
    _phoneVerificationRepo;
    _notificationService;
    _classRepository;
    _syllabusRepository;
    constructor(_bookingRepository, _facultyRepository, _chapterRepository, _studentRepository, _subjectVariantRepository, _phoneVerificationRepo, _notificationService, _classRepository, _syllabusRepository) {
        this._bookingRepository = _bookingRepository;
        this._facultyRepository = _facultyRepository;
        this._chapterRepository = _chapterRepository;
        this._studentRepository = _studentRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
        this._phoneVerificationRepo = _phoneVerificationRepo;
        this._notificationService = _notificationService;
        this._classRepository = _classRepository;
        this._syllabusRepository = _syllabusRepository;
    }
    async execute(dto) {
        const { user, booking } = dto;
        let currentChapterSlot = null;
        // class and syllabus validation
        const classExists = await this._classRepository.findById(user.class);
        if (!classExists) {
            throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const syllabusExists = await this._syllabusRepository.findById(user.syllabus);
        if (!syllabusExists) {
            throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        //phone number verification
        const verification = await this._phoneVerificationRepo.findByPhoneNumber(user.phoneNumber);
        if (!verification || !verification.isVerified) {
            throw new CustomError(ResponseMessages.PHONE_NOT_VERIFIED, HttpStatusCode.BAD_REQUEST);
        }
        /* ─────────────────────────────────────────────
         *  USER → STUDENT CREATION (idempotent)
         * ───────────────────────────────────────────── */
        let student = await this._studentRepository.findByNamePhoneNumber(user.phoneNumber);
        const newStudent = new Student({
            id: null,
            name: user.name,
            class: user.class,
            place: user.place,
            phoneNumber: user.phoneNumber,
            school: user.school,
            syllabus: user.syllabus,
            isDeleted: false,
        });
        if (!student) {
            student = await this._studentRepository.create(newStudent);
        }
        else if (student) {
            let updatedStudent = student.changeClassAndName(user.class, user.syllabus);
            student = await this._studentRepository.save(updatedStudent);
        }
        const alreadyBooked = await this._bookingRepository.findExistingBooking({
            studentId: student.id,
            facultyId: booking.facultyId,
            type: booking.type,
            mode: booking.mode,
            isDeleted: false,
            chapterId: booking.mode === "chapter" ? booking.chapterId : null,
            slotId: booking.mode === "slot" && booking.slotId?.[0]
                ? booking.slotId[0]
                : null,
        });
        if (alreadyBooked) {
            throw new CustomError(ResponseMessages.BOOKING_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        /* ─────────────────────────────────────────────
         *  BUSINESS INVARIANTS (not DTO validation)
         * ───────────────────────────────────────────── */
        validateBookingModeInvariant(booking);
        /* ─────────────────────────────────────────────
         *  READ-ONLY VALIDATION PHASE
         *    (no mutations here)
         * ───────────────────────────────────────────── */
        // Faculty must exist
        let faculty;
        if (booking.mode === "slot") {
            const subjectVariantIds = await this._subjectVariantRepository.findAllIds({
                class: student.class,
                syllabus: student.syllabus,
            });
            faculty = await this._facultyRepository.findFacultyByQuery({
                subjectOffering: { $in: subjectVariantIds },
                _id: booking.facultyId,
                isDeleted: false,
            });
            if (!faculty || faculty.isDeleted) {
                throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
        }
        if (booking.mode === "chapter") {
            faculty = await this._facultyRepository.findFacultyByQuery({
                "chapterSlots.chapter": booking.chapterId,
                _id: booking.facultyId,
                isDeleted: false,
            });
            if (!faculty || faculty.isDeleted) {
                throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
        }
        // Slot validation (if slot mode)
        if (booking.mode === "slot") {
            const reqSlotId = booking?.slotId?.[0];
            const currentSlot = await this._facultyRepository.getSlot(booking.facultyId, reqSlotId);
            validateSlotForBooking(currentSlot, booking.type, student.id);
        }
        //chapter validation (if chapter mode)
        if (booking.mode === "chapter") {
            const chapter = await this._chapterRepository.findById(booking.chapterId);
            if (!chapter || chapter.isDeleted) {
                throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
            currentChapterSlot = await this._facultyRepository.getChapterSlot(booking.facultyId, booking.chapterId);
            validateChapterSlotForBooking(currentChapterSlot, booking.type, student.id);
        }
        /* ─────────────────────────────────────────────
         *  MUTATION PHASE — CREATE BOOKING
         * ───────────────────────────────────────────── */
        const bookingProps = {
            id: null,
            userId: student.id,
            facultyId: booking.facultyId,
            type: booking.type,
            mode: booking.mode,
            class: user.class,
            syllabus: user.syllabus,
            status: "interested",
            isContacted: false,
            isDeleted: false,
        };
        if (booking.mode === "slot") {
            bookingProps.slotId = booking.slotId;
        }
        if (booking.mode === "chapter") {
            bookingProps.chapterId = booking.chapterId;
        }
        const bookingEntity = new Booking(bookingProps);
        const created = await this._bookingRepository.create(bookingEntity);
        if (!created) {
            throw new CustomError(ResponseMessages.BOOKING_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        // add to pooling if only booking is success
        try {
            if (booking.type === "pooling" && booking.mode === "chapter") {
                await this._facultyRepository.addToChapterSlotPool(booking.facultyId, currentChapterSlot?.id, student.id);
            }
            if (booking.type === "pooling" && booking.mode === "slot") {
                const reqSlotId = booking?.slotId?.[0];
                await this._facultyRepository.addToSlotPool(booking.facultyId, reqSlotId, student.id);
            }
        }
        catch (err) {
            await this._bookingRepository.deleteById(created.id); // soft delete
            throw err;
        }
        await this._notificationService.sendBookingConfirmation(student.phoneNumber, created.id);
    }
};
CreateBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __param(2, inject("IChapterRepository")),
    __param(3, inject("IStudentRepository")),
    __param(4, inject("ISubjectVariantRepository")),
    __param(5, inject("IPhoneVerificationRepository")),
    __param(6, inject("INotificationService")),
    __param(7, inject("IClassRepository")),
    __param(8, inject("ISyllabusRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Function, Object, Object])
], CreateBookingUseCase);
export { CreateBookingUseCase };
//# sourceMappingURL=crete.booking.use-case.js.map