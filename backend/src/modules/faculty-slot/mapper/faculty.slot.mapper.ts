import { FacultySlot } from "../entities/faculty.slot.entity.js";
import type { FacultySlotAdminView } from "../types/faculty.slot.type.js";

export class FacultySlotMapper {
  static toDomain(doc: any): FacultySlot | null {
    if (!doc) return null;

    return new FacultySlot({
      id: doc._id?.toString() ?? null,
      facultyId: doc.facultyId?.toString(),
      variantId: doc.variantId?.toString(),
      time: doc.time,
      isAvailable: doc.isAvailable,
      pool: (doc.pool ?? []).map((u: any) => u.toString()),
      poolLimit: doc.poolLimit,
      poolCycle: doc.poolCycle ?? 1,
    });
  }

  static toPersistence(entity: FacultySlot): any {
    return {
      facultyId: entity.facultyId,
      variantId: entity.variantId,
      time: entity.time,
      isAvailable: entity.isAvailable,
      pool: entity.pool,
      poolLimit: entity.poolLimit,
      poolCycle: entity.poolCycle,
    };
  }

  static toAdminView(doc: any): FacultySlotAdminView {
    return {
      id: doc._id?.toString(),
      variantId: doc.variantId?.toString(),
      time: new Date(doc.time).toISOString().slice(11, 16),
      isAvailable: doc.isAvailable,
      pool: (doc.pool ?? []).map((u: any) => ({ id: u._id?.toString() ?? u.toString() })),
      poolLimit: doc.poolLimit,
    };
  }
}
