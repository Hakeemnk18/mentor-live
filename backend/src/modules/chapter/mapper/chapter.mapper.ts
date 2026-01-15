import { Chapter } from "../entities/chapter.entity.js";

export class ChapterMapper {
  static toDomain(chapterModelData: any): Chapter | null {
    if (!chapterModelData) {
      return null;
    }

    const idString =
      chapterModelData._id?.toString() || chapterModelData.id?.toString();

    if (!idString) {
      console.error("Chapter data from DB is missing an ID:", chapterModelData);
      return null;
    }

    return new Chapter({
      id: idString,
      icon: chapterModelData.icon,
      name: chapterModelData.name,
      price: chapterModelData.price,
      subjectVariant:
        chapterModelData.subjectVariant?.toString() ||
        chapterModelData.subjectVariant,
      isDeleted: chapterModelData.isDeleted,
    });
  }

  static toPersistence(chapterEntity: Chapter): any {
    return {
      icon: chapterEntity.icon,
      name: chapterEntity.name,
      price: chapterEntity.price,
      subjectVariant: chapterEntity.subjectVariant,
      isDeleted: chapterEntity.isDeleted,
    };
  }
}
