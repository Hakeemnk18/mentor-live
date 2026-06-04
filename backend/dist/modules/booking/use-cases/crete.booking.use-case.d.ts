import type { ICreateBookingUseCase } from "./interfaces/create.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { IStudentRepository } from "../../student/repositories/student.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { CreateBookingRequestDto } from "../dto/create.booking.dto.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { INotificationService } from "../../../core/ports/notification.service.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";
export declare class CreateBookingUseCase implements ICreateBookingUseCase {
    private readonly _bookingRepository;
    private readonly _facultyRepository;
    private readonly _chapterRepository;
    private readonly _studentRepository;
    private readonly _subjectVariantRepository;
    private readonly _phoneVerificationRepo;
    private readonly _notificationService;
    private readonly _classRepository;
    private readonly _syllabusRepository;
    constructor(_bookingRepository: IBookingRepository, _facultyRepository: IFacultyRepository, _chapterRepository: IChapterRepository, _studentRepository: IStudentRepository, _subjectVariantRepository: ISubjectVariantRepository, _phoneVerificationRepo: IPhoneVerificationRepository, _notificationService: INotificationService, _classRepository: IClassRepository, _syllabusRepository: ISyllabusRepository);
    execute(dto: CreateBookingRequestDto): Promise<void>;
}
//# sourceMappingURL=crete.booking.use-case.d.ts.map