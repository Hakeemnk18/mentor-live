import type { ClientSession } from "mongoose";
import type { FacultySlot } from "../entities/faculty.slot.entity.js";
import type {
  AvailableSlotView,
  FacultySlotAdminView,
  FacultySlotCreationProps,
} from "../types/faculty.slot.type.js";

export interface IFacultySlotRepository {
  /** Bulk-create slots (used during faculty creation and addSlots) */
  createMany(slots: FacultySlotCreationProps[]): Promise<void>;

  /** Find a single slot by its _id */
  findById(slotId: string): Promise<FacultySlot | null>;

  /** All slots for a faculty+variant (admin view, includes unavailable) */
  findByFacultyAndVariant(
    facultyId: string,
    variantId: string,
  ): Promise<FacultySlot[]>;

  /** All slots for a faculty across all variants (admin full view) */
  findAllByFaculty(facultyId: string): Promise<FacultySlotAdminView[]>;

  /** Available slots for a faculty+variant (student picker) */
  getAvailableByFacultyAndVariant(
    facultyId: string,
    variantId: string,
  ): Promise<AvailableSlotView[]>;

  /** Set isAvailable on a single slot */
  setAvailability(slotId: string, isAvailable: boolean): Promise<void>;

  /**
   * Cross-disable: set isAvailable=false on every slot that shares
   * (facultyId, time) but is NOT slotId.
   * Returns the IDs of the slots that were disabled.
   */
  crossDisable(
    facultyId: string,
    time: Date,
    excludeSlotId: string,
  ): Promise<string[]>;

  /**
   * Cross-re-enable: set isAvailable=true on every slot that shares
   * (facultyId, time) but is NOT slotId.
   */
  crossEnable(
    facultyId: string,
    time: Date,
    excludeSlotId: string,
  ): Promise<void>;

  /** Atomically push a student into the pool if slot is available and not full */
  addToPool(slotId: string, studentId: string): Promise<void>;

  /** Pull a student from the pool */
  removeFromPool(
    slotId: string,
    studentId: string,
    session: ClientSession,
  ): Promise<void>;

  /**
   * Consume: set isAvailable=false and clear pool (used when session confirmed).
   * Also returns the time so callers can trigger cross-disable.
   */
  consumeSlot(slotId: string, session: ClientSession): Promise<{ time: Date; facultyId: string }>;

  /**
   * Re-open a consumed slot: set isAvailable=true, pool stays empty.
   * Used when a confirmed booking is later cancelled/expired.
   */
  reOpenSlot(slotId: string, session?: ClientSession): Promise<{ time: Date; facultyId: string }>;
}
