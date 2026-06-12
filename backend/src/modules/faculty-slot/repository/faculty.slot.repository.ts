import { Types } from "mongoose";
import type { ClientSession } from "mongoose";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { FacultySlot } from "../entities/faculty.slot.entity.js";
import { FacultySlotModel } from "../infrastructure/faculty.slot.schema.js";
import { FacultySlotMapper } from "../mapper/faculty.slot.mapper.js";
import type { IFacultySlotRepository } from "./faculty.slot.repository.interface.js";
import type {
  AvailableSlotView,
  FacultySlotAdminView,
  FacultySlotCreationProps,
} from "../types/faculty.slot.type.js";

export class FacultySlotRepository implements IFacultySlotRepository {
  /* ─── Creation ─────────────────────────────────────────────────────── */

  async createMany(slots: FacultySlotCreationProps[]): Promise<void> {
    const docs = slots.map((s) => ({
      facultyId: new Types.ObjectId(s.facultyId),
      variantId: new Types.ObjectId(s.variantId),
      time: s.time,
      isAvailable: true,
      pool: [],
      poolLimit: s.poolLimit ?? 5,
    }));

    await FacultySlotModel.insertMany(docs, { ordered: false });
  }

  /* ─── Fetching ──────────────────────────────────────────────────────── */

  async findById(slotId: string): Promise<FacultySlot | null> {
    const doc = await FacultySlotModel.findById(slotId).lean();
    return FacultySlotMapper.toDomain(doc);
  }

  async findByFacultyAndVariant(
    facultyId: string,
    variantId: string,
  ): Promise<FacultySlot[]> {
    const docs = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(facultyId),
      variantId: new Types.ObjectId(variantId),
    })
      .sort({ time: 1 })
      .lean();

    return docs
      .map(FacultySlotMapper.toDomain)
      .filter((s): s is FacultySlot => s !== null);
  }

  async findAllByFaculty(facultyId: string): Promise<FacultySlotAdminView[]> {
    const docs = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(facultyId),
    })
      .populate({ path: "pool", select: "_id" })
      .sort({ variantId: 1, time: 1 })
      .lean();

    return docs.map(FacultySlotMapper.toAdminView);
  }

  async getAvailableByFacultyAndVariant(
    facultyId: string,
    variantId: string,
  ): Promise<AvailableSlotView[]> {
    const docs = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(facultyId),
      variantId: new Types.ObjectId(variantId),
      isAvailable: true,
    })
      .select("_id time variantId pool poolLimit")
      .sort({ time: 1 })
      .lean();

    return docs.map((d: any) => ({
      id: d._id.toString(),
      time: d.time,
      variantId: d.variantId.toString(),
      poolCount: Array.isArray(d.pool) ? d.pool.length : 0,
      poolLimit: d.poolLimit ?? 5,
    }));
  }

  async getAllAvailableByFaculty(facultyId: string): Promise<AvailableSlotView[]> {
    const docs = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(facultyId),
      isAvailable: true,
    })
      .select("_id time variantId pool poolLimit")
      .sort({ time: 1 })
      .lean();

    return docs.map((d: any) => ({
      id: d._id.toString(),
      time: d.time,
      variantId: d.variantId.toString(),
      poolCount: Array.isArray(d.pool) ? d.pool.length : 0,
      poolLimit: d.poolLimit ?? 5,
    }));
  }

  /* ─── Availability management ───────────────────────────────────────── */

  async setAvailability(slotId: string, isAvailable: boolean): Promise<void> {
    /*
     * Re-enabling a slot starts a fresh pooling round: bump poolCycle so
     * new bookings are tied to this round and don't get grouped together
     * with bookings from the previous (already consumed) round.
     */
    const update: any = { $set: { isAvailable } };
    if (isAvailable) {
      update.$inc = { poolCycle: 1 };
    }

    const result = await FacultySlotModel.updateOne(
      { _id: new Types.ObjectId(slotId) },
      update,
    );

    if (result.matchedCount === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
  }

  async crossDisable(
    facultyId: string,
    time: Date,
    excludeSlotId: string,
  ): Promise<string[]> {
    /* Find all other slots at the same (facultyId, time) */
    const siblings = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(facultyId),
      time,
      _id: { $ne: new Types.ObjectId(excludeSlotId) },
      isAvailable: true,
    })
      .select("_id")
      .lean();

    if (siblings.length === 0) return [];

    const siblingIds = siblings.map((s: any) => s._id);

    await FacultySlotModel.updateMany(
      { _id: { $in: siblingIds } },
      { $set: { isAvailable: false } },
    );

    return siblingIds.map((id: any) => id.toString());
  }

  async crossEnable(
    facultyId: string,
    time: Date,
    excludeSlotId: string,
  ): Promise<void> {
    await FacultySlotModel.updateMany(
      {
        facultyId: new Types.ObjectId(facultyId),
        time,
        _id: { $ne: new Types.ObjectId(excludeSlotId) },
      },
      { $set: { isAvailable: true } },
    );
  }

  /* ─── Pool management ───────────────────────────────────────────────── */

  async addToPool(slotId: string, studentId: string, session?: ClientSession): Promise<void> {
    /*
     * Atomic: only push if slot is available AND pool has room.
     * $expr compares sizes within the same document.
     */
    const result = await FacultySlotModel.updateOne(
      {
        _id: new Types.ObjectId(slotId),
        isAvailable: true,
        $expr: { $lt: [{ $size: "$pool" }, "$poolLimit"] },
      },
      {
        $addToSet: { pool: new Types.ObjectId(studentId) },
      },
      { ...(session ? { session } : {}) },
    );

    if (result.matchedCount === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }
  }

  async removeFromPool(
    slotId: string,
    studentId: string,
    session: ClientSession,
  ): Promise<void> {
    await FacultySlotModel.updateOne(
      { _id: new Types.ObjectId(slotId) },
      { $pull: { pool: new Types.ObjectId(studentId) } },
      { session },
    );
  }

  /* ─── Consume / Re-open ─────────────────────────────────────────────── */

  async consumeSlot(
    slotId: string,
    session: ClientSession,
  ): Promise<{ time: Date; facultyId: string }> {
    const doc = await FacultySlotModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(slotId),
        isAvailable: true,
      },
      { $set: { isAvailable: false, pool: [] } },
      { new: false, session },     // return OLD doc to read time + facultyId
    ).lean() as any;

    if (!doc) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    return {
      time: doc.time,
      facultyId: doc.facultyId.toString(),
    };
  }

  async reOpenSlot(
    slotId: string,
    session?: ClientSession,
  ): Promise<{ time: Date; facultyId: string }> {
    /*
     * Re-opening a previously-consumed slot starts a fresh pooling round:
     * bump poolCycle so new bookings are tied to this round and don't get
     * grouped together with bookings from the previous (confirmed) round.
     */
    const doc = await FacultySlotModel.findOneAndUpdate(
      { _id: new Types.ObjectId(slotId) },
      { $set: { isAvailable: true }, $inc: { poolCycle: 1 } },
      { new: false, ...(session ? { session } : {}) },
    ).lean() as any;

    if (!doc) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    return {
      time: doc.time,
      facultyId: doc.facultyId.toString(),
    };
  }

  /* ─── Variant sync helpers ──────────────────────────────────────────── */

  async hasActivePooledSlots(
    facultyId: string,
    variantIds: string[],
  ): Promise<boolean> {
    if (variantIds.length === 0) return false;
    const count = await FacultySlotModel.countDocuments({
      facultyId: new Types.ObjectId(facultyId),
      variantId: { $in: variantIds.map((id) => new Types.ObjectId(id)) },
      "pool.0": { $exists: true }, // pool array is non-empty
    });
    return count > 0;
  }

  async deleteByFacultyAndVariants(
    facultyId: string,
    variantIds: string[],
  ): Promise<void> {
    if (variantIds.length === 0) return;
    await FacultySlotModel.deleteMany({
      facultyId: new Types.ObjectId(facultyId),
      variantId: { $in: variantIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  async findDistinctTimesByFaculty(facultyId: string): Promise<Date[]> {
    const times = await FacultySlotModel.distinct("time", {
      facultyId: new Types.ObjectId(facultyId),
    });
    return times as Date[];
  }
}
