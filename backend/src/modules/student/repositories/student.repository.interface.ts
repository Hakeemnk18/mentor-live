import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Student } from "../entities/student.entity.js";

export interface IStudentRepository {
  create(studentEntity: Student): Promise<Student>;
  findById(id: string): Promise<Student | null>;
  findByName(name: string): Promise<Student | null>;
  save(studentEntity: Student): Promise<Student>;
  findAllForAdmin(allDoc: IGetAllDocDB): Promise<Student[]>;
  findAllForUser(): Promise<
    { id: string; name: string }[]
  >;
  countDocument(query: Record<string, any>): Promise<number>;
  findByNamePhoneNumber(phoneNumber: string): Promise<Student | null >
}
