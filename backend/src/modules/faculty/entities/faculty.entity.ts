import type { ImageValue } from "../../../core/shared/type/image.type.js";
import type {
  ChapterSlotProps,
  FacultyProps,
  SlotProps,
} from "../types/faculty.type.js";

export class Faculty {
  public readonly id: string | null;
  public readonly name: string;
  public readonly qualifications: string[];
  public readonly description: string;
  public readonly demoClass: string;
  public readonly image: ImageValue;
  public readonly price: number;
  public readonly subjectOffering: string[];
  public readonly slots: SlotProps[];
  public readonly chapterSlots: ChapterSlotProps[];
  public readonly isDeleted: boolean;

  constructor(props: FacultyProps) {
    this.id = props.id;
    this.name = props.name;
    this.qualifications = props.qualifications;
    this.description = props.description;
    this.demoClass = props.demoClass;
    this.image = props.image;
    this.price = props.price;
    this.subjectOffering = props.subjectOffering;
    this.slots = props.slots;
    this.chapterSlots = props.chapterSlots;
    this.isDeleted = props.isDeleted;
  }

  /* ---------- Status ---------- */

  isActive(): boolean {
    return !this.isDeleted;
  }

  markAsDeleted(): Faculty {
    return {
      ...this,
      isDeleted: true,
    };
  }

  markAsUnblocked(): Faculty {
    return {
      ...this,
      isDeleted: false,
    };
  }

  /* ---------- Slots ---------- */

  getAvailableSlots(): SlotProps[] {
    return this.slots.filter((slot) => slot.isAvailable);
  }

  getAvailableChapterSlots(): ChapterSlotProps[] {
    return this.chapterSlots.filter((slot) => slot.isAvailable);
  }

  isSlotFull(slot: SlotProps): boolean {
    return slot.pool.length >= slot.poolLimit;
  }

  updateProfile(props: {
    name: string;
    qualifications: string[];
    description: string;
    demoClass: string;
    image: ImageValue;
    price: number;
    subjectOffering: string[];
  }): Faculty {
    return {
      ...this,
      name: props.name,
      qualifications: props.qualifications,
      description: props.description,
      demoClass: props.demoClass,
      image: props.image,
      price: props.price,
      subjectOffering: props.subjectOffering,
    };
  }

  /* ---------- Pricing ---------- */

  hasPrice(): boolean {
    return this.price > 0;
  }

  /* ---------- add slot ---------- */
  addSlots(newSlots: { time: Date }[]): Faculty {
  const existingTimes = new Set(
    this.slots.map(s => s.time.getTime()),
  );

  const slotsToAdd = newSlots.map(slot => {
    const t = slot.time.getTime();
    if (existingTimes.has(t)) {
      throw new Error("DUPLICATE_SLOT");
    }

    existingTimes.add(t);

    return {
      time: slot.time,
      isAvailable: true,
      pool: [],
      poolLimit: 5,
    };
  });

  return {
    ...this,
    slots: [...this.slots, ...slotsToAdd],
  };
}
}
