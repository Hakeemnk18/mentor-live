import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Student } from "../entities/student.entity.js";
import type { IStudentRepository } from "./student.repository.interface.js";
export declare class StudentRepository implements IStudentRepository {
    create(studentEntity: Student): Promise<Student>;
    findById(id: string): Promise<Student | null>;
    findByName(name: string): Promise<Student | null>;
    findByNamePhoneNumber(phoneNumber: string): Promise<Student | null>;
    save(studentEntity: Student): Promise<Student>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Student[]>;
    findAllForUser(): Promise<{
        id: string;
        name: string;
    }[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    getStudentCountInRange(startDate: Date, endDate: Date): Promise<number>;
    getDailyStudentKpiStats(startDate: Date, endDate: Date): Promise<{
        _id: string;
        count: number;
    }[]>;
}
//# sourceMappingURL=student.repository.d.ts.map