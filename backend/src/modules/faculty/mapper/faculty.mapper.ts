import { Faculty } from "../entities/faculty.entity.js";
import type {
  FacultyDetailsViewForUser,
  FacultyView,
} from "../types/faculty.type.js";

export class FacultyMapper {
  static toDomain(facultyModelData: any): Faculty | null {
    if (!facultyModelData) {
      return null;
    }

    const idString =
      facultyModelData._id?.toString() || facultyModelData.id?.toString();

    if (!idString) {
      console.error("Faculty data from DB is missing an ID:", facultyModelData);
      return null;
    }

    return new Faculty({
      id: idString,
      name: facultyModelData.name,
      qualifications: facultyModelData.qualifications ?? [],
      description: facultyModelData.description,
      demoClass: facultyModelData.demoClass,
      image: {
        url: facultyModelData.image.url,
        publicId: facultyModelData.image.publicId,
      },
      subjectOffering: (facultyModelData.subjectOffering ?? []).map(
        (so: any) => ({
          variantId: so.variantId?.toString() ?? so.variantId,
          price: so.price,
        }),
      ),

      slots: (facultyModelData.slots ?? []).map((slot: any) => ({
        id: slot._id?.toString(),
        time: slot.time,
        isAvailable: slot.isAvailable,
        pool: (slot.pool ?? []).map((u: any) => u.toString()),
        poolLimit: slot.poolLimit,
      })),

      chapterSlots: (facultyModelData.chapterSlots ?? []).map((slot: any) => ({
        id: slot._id?.toString(),
        chapterId: slot.chapter?.toString(),
        isAvailable: slot.isAvailable,
        pool: (slot.pool ?? []).map((u: any) => u.toString()),
        poolLimit: slot.poolLimit,
      })),

      isDeleted: facultyModelData.isDeleted,
    });
  }

  static toPersistence(facultyEntity: Faculty): any {
    return {
      name: facultyEntity.name,
      qualifications: facultyEntity.qualifications,
      description: facultyEntity.description,
      demoClass: facultyEntity.demoClass,
      image: {
        url: facultyEntity.image.url,
        publicId: facultyEntity.image.publicId,
      },
      subjectOffering: facultyEntity.subjectOffering.map((so) => ({
        variantId: so.variantId,
        price: so.price,
      })),
      slots: facultyEntity.slots.map((slot) => ({
        time: slot.time,
        isAvailable: slot.isAvailable,
        pool: slot.pool,
        poolLimit: slot.poolLimit,
      })),
      chapterSlots: facultyEntity.chapterSlots.map((slot) => ({
        chapter: slot.chapterId,
        isAvailable: slot.isAvailable,
        pool: slot.pool,
        poolLimit: slot.poolLimit,
      })),
      isDeleted: facultyEntity.isDeleted,
    };
  }

  static toView(raw: any): FacultyView {
    return {
      id: raw._id?.toString() ?? null,
      name: raw.name,
      qualifications: raw.qualifications ?? [],
      description: raw.description,
      demoClass: raw.demoClass,
      image: raw.image,
      isDeleted: raw.isDeleted ?? false,
    };
  }

  static toFacultyUserView(doc: any) {
    const price =
      typeof doc.price === "number"
        ? doc.price
        : doc.subjectOffering?.length > 0
          ? Math.min(...doc.subjectOffering.map((s: any) => s.price))
          : 0;

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications,
      description: doc.description,
      price,
      image: doc.image.url,
    };
  }

  static toFacultyWithSlotToUserView(doc: any): FacultyDetailsViewForUser {
    const price =
      typeof doc.price === "number"
        ? doc.price
        : doc.subjectOffering?.length > 0
          ? doc.subjectOffering[0].price
          : 0;

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications,
      description: doc.description,
      demoClass: doc.demoClass,
      image: doc.image.url,
      price,
      slot: {
        id: doc.slots._id.toString(),
        isAvailable: doc.slots.isAvailable,
        time: doc.slots.time,
        pool: doc.slots.pool,
        poolLimit: doc.slots.poolLimit,
      },
    };
  }
}
