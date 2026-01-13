import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Class } from "../entities/class.entity.js";

export interface IClassRepository {
  create(classEntity: Class): Promise<Class>;
  findById(id: string): Promise<Class | null>;
  findByName(name: string): Promise<Class | null>;
  save(classEntity: Class): Promise<Class>;
  findAllForAdmin(allDoc: IGetAllDocDB ): Promise<Class[]>;
  findAllForUser(): Promise<{ id: string; name: string }[]>;
  countDocument( query: Record<string, any >): Promise<number>
}