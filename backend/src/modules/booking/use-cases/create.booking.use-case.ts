import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { Booking, type BookingProps } from "../entities/booking.entity.js";
import type { ICreateBookingUseCase } from "./interfaces/create.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { IStudentRepository } from "../../student/repositories/student.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { CreateBookingRequestDto } from "../dto/create.booking.dto.js";
import { Student } from "../../student/entities/student.entity.js";
import { validateBookingModeInvariant } from "../utils/booking.invariant.js";
import { validateChapterSlotForBooking } from "../utils/chapter.slot.pool.invariant.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { ChapterSlotProps } from "../../faculty/types/faculty.type.js";
import type { FacultySlot } from "../../faculty-slot/entities/faculty.slot.entity.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { INotificationService } from "../../../core/ports/notification.service.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,

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
  ) { }

  async execute(dto: CreateBookingRequestDto): Promise<void> {
    const { user, booking } = dto;

    let currentChapterSlot: ChapterSlotProps | null = null;
    let currentSlot: FacultySlot | null = null;

    /* ── Class + syllabus validation ── */
    const classExists = await this._classRepository.findById(user.class);
    if (!classExists) {
      throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const syllabusExists = await this._syllabusRepository.findById(user.syllabus);
    if (!syllabusExists) {
      throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    /* ── Phone verification ── */
    const verification = await this._phoneVerificationRepo.findByPhoneNumber(
      user.phoneNumber,
    );
    if (!verification || !verification.isVerified) {
      throw new CustomError(ResponseMessages.PHONE_NOT_VERIFIED, HttpStatusCode.BAD_REQUEST);
    }

    const session = await mongoose.startSession();
    let student!: Student;
    let created!: Booking;

    try {
      session.startTransaction();

      /* ── Student upsert ── */
      const existingStudent = await this._studentRepository.findByNamePhoneNumber(
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

      if (!existingStudent) {
        student = await this._studentRepository.create(newStudent, session);
      } else {
        const updatedStudent = existingStudent.changeClassAndName(user.class, user.syllabus);
        student = await this._studentRepository.save(updatedStudent, session);
      }

      /* ── Duplicate booking guard ── */
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
        throw new CustomError(ResponseMessages.BOOKING_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
      }

      /* ── Booking mode invariant ── */
      validateBookingModeInvariant(booking);

      /* ═══════════════════════════════════════════════
       *  SLOT MODE — uses FacultySlot collection
       * ═══════════════════════════════════════════════ */
      if (booking.mode === "slot") {
        const reqSlotId = booking.slotId![0]!;
        const reqVariantId = booking.subjectVariantId!;

        /* Faculty must exist and teach this variant */
        const faculty = await this._facultyRepository.findFacultyByQuery({
          _id: booking.facultyId,
          isDeleted: false,
          "subjectOffering.variantId": reqVariantId,
        });
        if (!faculty || faculty.isDeleted) {
          throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }

        /* Slot must exist, belong to the right faculty + variant, and be available */
        const slot = await this._facultySlotRepository.findById(reqSlotId);
        currentSlot = slot;

        if (!slot) {
          throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (slot.facultyId !== booking.facultyId) {
          throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
        }
        if (slot.variantId !== reqVariantId) {
          throw new CustomError(
            "This slot does not belong to the selected subject variant",
            HttpStatusCode.BAD_REQUEST,
          );
        }
        if (!slot.isAvailable) {
          throw new CustomError(
            ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
            HttpStatusCode.BAD_REQUEST,
          );
        }
        if (booking.type === "oneToOne" && slot.pool.length > 0) {
          throw new CustomError(
            ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
            HttpStatusCode.BAD_REQUEST,
          );
        }
        if (booking.type === "pooling" && slot.isFull()) {
          throw new CustomError(
            ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
            HttpStatusCode.BAD_REQUEST,
          );
        }
      }

      /* ═══════════════════════════════════════════════
       *  CHAPTER MODE — unchanged logic
       * ═══════════════════════════════════════════════ */
      if (booking.mode === "chapter") {
        const faculty = await this._facultyRepository.findFacultyByQuery({
          "chapterSlots.chapter": booking.chapterId,
          _id: booking.facultyId,
          isDeleted: false,
        });
        if (!faculty || faculty.isDeleted) {
          throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }

        const chapter = await this._chapterRepository.findById(booking.chapterId!);
        if (!chapter || chapter.isDeleted) {
          throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }

        currentChapterSlot = await this._facultyRepository.getChapterSlot(
          booking.facultyId,
          booking.chapterId!,
        );

        validateChapterSlotForBooking(currentChapterSlot, booking.type, student.id!);
      }

      /* ═══════════════════════════════════════════════
       *  MUTATION PHASE — create booking
       * ═══════════════════════════════════════════════ */
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
        bookingProps.subjectVariantId = booking.subjectVariantId!;
      }

      if (booking.mode === "chapter") {
        bookingProps.chapterId = booking.chapterId!;
      }

      /*
       * Stamp the slot's/chapter slot's CURRENT poolCycle onto pooling
       * bookings, so this booking stays tied to the round it was created
       * in even after the slot is consumed and reused for a later round.
       */
      if (booking.type === "pooling") {
        if (booking.mode === "slot") {
          bookingProps.poolCycle = currentSlot?.poolCycle ?? 1;
        }
        if (booking.mode === "chapter") {
          bookingProps.poolCycle = currentChapterSlot?.poolCycle ?? 1;
        }
      }

      const bookingEntity = new Booking(bookingProps);
      created = await this._bookingRepository.create(bookingEntity, session);

      if (!created) {
        throw new CustomError(
          ResponseMessages.BOOKING_CREATION_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      /* ── Add to pool (pooling type only) ──
       * No manual compensation/rollback needed here: if either of these
       * throws (e.g. pool already full), the catch below aborts the whole
       * transaction and the student upsert + booking insert are undone too.
       */
      if (booking.type === "pooling" && booking.mode === "chapter") {
        await this._facultyRepository.addToChapterSlotPool(
          booking.facultyId,
          currentChapterSlot?.id!,
          student.id!,
          session,
        );
      }

      if (booking.type === "pooling" && booking.mode === "slot") {
        await this._facultySlotRepository.addToPool(
          booking.slotId![0]!,
          student.id!,
          session,
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    /* ── Notification — fire-and-forget, never blocks or fails the booking ── */
    this._notificationService
      .sendBookingConfirmation(student.phoneNumber, created.id!)
      .catch((err: unknown) => {
        console.error("[CreateBookingUseCase] Failed to send booking confirmation:", err);
      });
  }
}
