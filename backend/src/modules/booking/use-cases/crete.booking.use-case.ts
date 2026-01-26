import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { Types } from "mongoose";
import { Booking, type BookingProps } from "../entities/booking.entity.js";
import type { ICreateBookingUseCase } from "./interfaces/create.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { IStudentRepository } from "../../student/repositories/student.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { CreateBookingRequestDto } from "../dto/create.booking.dto.js";
import { Student } from "../../student/entities/student.entity.js";
import { validateBookingModeInvariant } from "../utils/booking.invariant.js";
import { validateSlotForBooking } from "../utils/slot.pool.invariant.js";
import { validateChapterSlotForBooking } from "../utils/chapter.slot.pool.invariant.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { ChapterSlotProps } from "../../faculty/types/faculty.type.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { INotificationService } from "../../../core/ports/notification.service.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";
const { ObjectId } = Types;

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("IStudentRepository")
    private readonly _studentRepository: IStudentRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,

    @inject("IPhoneVerificationRepository")
    private readonly _phoneVerificationRepo: IPhoneVerificationRepository,

    @inject("INotificationService")
    private readonly _notificationService: INotificationService,

    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository,

    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository,
  ) {}

  async execute(dto: CreateBookingRequestDto): Promise<void> {
    const { user, booking } = dto;
    
    let currentChapterSlot: ChapterSlotProps | null = null;

    // class and syllabus validation
    const classExists = await this._classRepository.findById(user.class);
    if (!classExists) {
      throw new CustomError(
        ResponseMessages.CLASS_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    

    const syllabusExists = await this._syllabusRepository.findById(user.syllabus);
    if (!syllabusExists) {
      throw new CustomError(
        ResponseMessages.SYLLABUS_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    //phone number verification

    const verification = await this._phoneVerificationRepo.findByPhoneNumber(
      user.phoneNumber,
    );

    if (!verification || !verification.isVerified) {
      throw new CustomError(
        ResponseMessages.PHONE_NOT_VERIFIED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ─────────────────────────────────────────────
     *  USER → STUDENT CREATION (idempotent)
     * ───────────────────────────────────────────── */

    let student = await this._studentRepository.findByNamePhoneNumber(
      user.phoneNumber,
    );
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
    }else if(student){
      let updatedStudent = student.changeClassAndName(user.class, user.syllabus)
      student = await this._studentRepository.save(updatedStudent)
    }

    
    

    const alreadyBooked = await this._bookingRepository.findExistingBooking({
      studentId: student.id!,
      facultyId: booking.facultyId,
      type: booking.type,
      mode: booking.mode,
      isDeleted: false,
      chapterId: booking.mode === "chapter" ? booking.chapterId! : null,
      slotId:
        booking.mode === "slot" && booking.slotId?.[0]
          ? booking.slotId[0]
          : null,
    });

    if (alreadyBooked) {
      throw new CustomError(
        ResponseMessages.BOOKING_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST,
      );
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
      const subjectVariantIds = await this._subjectVariantRepository.findAllIds(
        {
          class: student.class,
          syllabus: student.syllabus,
        },
      );
      
      faculty = await this._facultyRepository.findFacultyByQuery({
        subjectOffering: { $in: subjectVariantIds },
        _id: booking.facultyId,
        isDeleted: false,
      });
      if (!faculty || faculty.isDeleted) {
        throw new CustomError(
          ResponseMessages.FACULTY_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    

    if (booking.mode === "chapter") {
      faculty = await this._facultyRepository.findFacultyByQuery({
        "chapterSlots.chapter": booking.chapterId,
        _id: booking.facultyId,
        isDeleted: false,
      });
      if (!faculty || faculty.isDeleted) {
        throw new CustomError(
          ResponseMessages.FACULTY_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    // Slot validation (if slot mode)
    if (booking.mode === "slot") {
      const reqSlotId = booking?.slotId?.[0];
      const currentSlot = await this._facultyRepository.getSlot(
        booking.facultyId,
        reqSlotId!,
      );

      validateSlotForBooking(currentSlot, booking.type, student.id!);
    }

    //chapter validation (if chapter mode)

    if (booking.mode === "chapter") {
      const chapter = await this._chapterRepository.findById(
        booking.chapterId!,
      );

      if (!chapter || chapter.isDeleted) {
        throw new CustomError(
          ResponseMessages.CHAPTER_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
      currentChapterSlot = await this._facultyRepository.getChapterSlot(
        booking.facultyId,
        booking.chapterId!,
      );

      validateChapterSlotForBooking(
        currentChapterSlot,
        booking.type,
        student.id!,
      );
    }

    /* ─────────────────────────────────────────────
     *  MUTATION PHASE — CREATE BOOKING
     * ───────────────────────────────────────────── */

    

    const bookingProps: BookingProps = {
      id: null,
      userId: student.id!,
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
      bookingProps.slotId = booking.slotId!;
    }

    if (booking.mode === "chapter") {
      bookingProps.chapterId = booking.chapterId!;
    }

    const bookingEntity = new Booking(bookingProps);

    const created = await this._bookingRepository.create(bookingEntity);

    if (!created) {
      throw new CustomError(
        ResponseMessages.BOOKING_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    // add to pooling if only booking is success
    try {
      if (booking.type === "pooling" && booking.mode === "chapter") {
        await this._facultyRepository.addToChapterSlotPool(
          booking.facultyId,
          currentChapterSlot?.id!,
          student.id!,
        );
      }

      if (booking.type === "pooling" && booking.mode === "slot") {
        const reqSlotId = booking?.slotId?.[0];
        await this._facultyRepository.addToSlotPool(
          booking.facultyId,
          reqSlotId!,
          student.id!,
        );
      }
    } catch (err) {
      await this._bookingRepository.deleteById(created.id!); // soft delete
      throw err;
    }
    
    await this._notificationService.sendBookingConfirmation(
      student.phoneNumber,
      created.id!,
    );
  }
}
