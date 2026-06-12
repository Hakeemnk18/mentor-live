import { Faculty } from "../entities/faculty.entity.js";
import type {
  FacultyDetailsViewForUser,
  FacultyView,
  FeaturedFacultyView,
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

      chapterSlots: (facultyModelData.chapterSlots ?? []).map((slot: any) => ({
        id: slot._id?.toString(),
        chapterId: slot.chapter?.toString(),
        isAvailable: slot.isAvailable,
        pool: (slot.pool ?? []).map((u: any) => u.toString()),
        poolLimit: slot.poolLimit,
        poolCycle: slot.poolCycle ?? 1,
      })),

      isDeleted: facultyModelData.isDeleted,
      isFeatured: facultyModelData.isFeatured ?? false,
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
      chapterSlots: facultyEntity.chapterSlots.map((slot) => ({
        chapter: slot.chapterId,
        isAvailable: slot.isAvailable,
        pool: slot.pool,
        poolLimit: slot.poolLimit,
        poolCycle: slot.poolCycle,
      })),
      isDeleted: facultyEntity.isDeleted,
      isFeatured: facultyEntity.isFeatured,
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
      isFeatured: raw.isFeatured ?? false,
    };
  }

  static toFeaturedView(raw: any): FeaturedFacultyView {
    return {
      id: raw._id?.toString() ?? raw.id,
      name: raw.name,
      qualifications: raw.qualifications ?? [],
      description: raw.description,
      image: {
        url: raw.image?.url ?? "",
        publicId: raw.image?.publicId ?? "",
      },
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
        id: doc.slot._id?.toString() ?? doc.slot.id,
        isAvailable: doc.slot.isAvailable,
        time: doc.slot.time,
        pool: (doc.slot.pool ?? []).map((u: any) => ({ id: u.toString() })),
        poolLimit: doc.slot.poolLimit,
      },
    };
  }
}
