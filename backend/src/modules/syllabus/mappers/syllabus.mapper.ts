import { Syllabus } from "../entities/syllabus.entity.js";

export class SyllabusMapper {
  static toDomain(syllabusModelData: any): Syllabus | null {
    if (!syllabusModelData) {
      return null;
    }

    const idString =
      syllabusModelData._id?.toString() || syllabusModelData.id?.toString();

    if (!idString) {
      console.error("Syllabus data from DB is missing an ID:", syllabusModelData);
      return null;
    }

    return new Syllabus({
      id: idString,
      name: syllabusModelData.name,
      isDeleted: syllabusModelData.isDeleted,
    });
  }

  static toPersistence(syllabusEntity: Syllabus): any {
    return {
      name: syllabusEntity.name,
      isDeleted: syllabusEntity.isDeleted,
    };
  }
}
