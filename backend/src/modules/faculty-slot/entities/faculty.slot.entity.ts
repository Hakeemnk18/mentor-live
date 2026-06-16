import type { FacultySlotProps } from "../types/faculty.slot.type.js";

export class FacultySlot {
  public readonly id: string | null;
  public readonly facultyId: string;
  public readonly variantId: string;
  public readonly time: Date;
  public readonly isAvailable: boolean;
  public readonly pool: string[];
  public readonly poolLimit: number;
  public readonly poolCycle: number;

  constructor(props: FacultySlotProps) {
    this.id = props.id;
    this.facultyId = props.facultyId;
    this.variantId = props.variantId;
    this.time = props.time;
    this.isAvailable = props.isAvailable;
    this.pool = props.pool;
    this.poolLimit = props.poolLimit;
    this.poolCycle = props.poolCycle;
  }

  isFull(): boolean {
    return this.pool.length >= this.poolLimit;
  }

  isOpenForBooking(): boolean {
    return this.isAvailable && !this.isFull();
  }

  open(): FacultySlot {
    return new FacultySlot({ ...this, isAvailable: true });
  }

  close(): FacultySlot {
    return new FacultySlot({ ...this, isAvailable: false });
  }

  consume(): FacultySlot {
    return new FacultySlot({ ...this, isAvailable: false, pool: [] });
  }

  addToPool(studentId: string): FacultySlot {
    if (this.isFull()) throw new Error("Slot pool is full");
    return new FacultySlot({
      ...this,
      pool: [...new Set([...this.pool, studentId])],
    });
  }

  removeFromPool(studentId: string): FacultySlot {
    return new FacultySlot({
      ...this,
      pool: this.pool.filter((id) => id !== studentId),
    });
  }
}
