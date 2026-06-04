import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { IStudentRepository } from "../../student/repositories/student.repository.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "./interfaces/get.analysis.kpi.cards.use-case.interface.js";
import type { AnalysisKpiCard } from "../type/analysis.type.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
export declare class GetAnalysisKpiCardsUseCase implements IGetAnalysisKpiCardsUseCase {
    private readonly _bookingRepository;
    private readonly _facultyRepository;
    private readonly _studentRepository;
    constructor(_bookingRepository: IBookingRepository, _facultyRepository: IFacultyRepository, _studentRepository: IStudentRepository);
    private calculateTrend;
    execute(): Promise<AnalysisKpiCard[]>;
}
//# sourceMappingURL=get.analysis.kpi.cards.use-case.d.ts.map