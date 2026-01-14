import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Subject } from "../entities/subject.entity.js";

export interface ISubjectRepository {
  create(subjectEntity: Subject): Promise<Subject>;
  findById(id: string): Promise<Subject | null>;
  findByName(name: string): Promise<Subject | null>;
  save(subjectEntity: Subject): Promise<Subject>;
  findAllForAdmin(allDoc: IGetAllDocDB): Promise<Subject[]>;
  findAllForUser(): Promise<{ id: string; name: string }[]>;
  countDocument(query: Record<string, any>): Promise<number>;
}