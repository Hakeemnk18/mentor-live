import { Faculty } from "../entities/faculty.entity.js"; 
import type { FacultyView } from "../types/faculty.type.js";

export class FacultyMapper {
  static toDomain(facultyModelData: any): Faculty | null {
    if (!facultyModelData) {
      return null;
    }

    const idString =
      facultyModelData._id?.toString() ||
      facultyModelData.id?.toString();

    if (!idString) {
      console.error(
        "Faculty data from DB is missing an ID:",
        facultyModelData
      );
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
      price: facultyModelData.price,
      subjectOffering: (facultyModelData.subjectOffering ?? []).map(
        (id: any) => id.toString()
      ),

      slots: (facultyModelData.slots ?? []).map((slot: any) => ({
        id: slot._id?.toString(),
        time: slot.time,
        isAvailable: slot.isAvailable,
        pool: (slot.pool ?? []).map((u: any) => u.toString()),
        poolLimit: slot.poolLimit,
      })),

      chapterSlots: (facultyModelData.chapterSlots ?? []).map(
        (slot: any) => ({
          id: slot._id?.toString(),
          chapterId: slot.chapter?.toString(),
          isAvailable: slot.isAvailable,
          pool: (slot.pool ?? []).map((u: any) => u.toString()),
          poolLimit: slot.poolLimit,
        })
      ),

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
      price: facultyEntity.price,
      subjectOffering: facultyEntity.subjectOffering,
      slots: facultyEntity.slots.map(slot => ({
        time: slot.time,
        isAvailable: slot.isAvailable,
        pool: slot.pool,
        poolLimit: slot.poolLimit,
      })),
      chapterSlots: facultyEntity.chapterSlots.map(slot => ({
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
      image: raw.image?.url,
      price: raw.price,
      isDeleted: raw.isDeleted ?? false,
    };
  }
}
