import { Chapter } from "../entities/chapter.entity.js";
export class ChapterMapper {
    static toDomain(chapterModelData) {
        if (!chapterModelData) {
            return null;
        }
        const idString = chapterModelData._id?.toString() || chapterModelData.id?.toString();
        if (!idString) {
            console.error("Chapter data from DB is missing an ID:", chapterModelData);
            return null;
        }
        return new Chapter({
            id: idString,
            icon: {
                url: chapterModelData.icon.url,
                publicId: chapterModelData.icon.publicId,
            },
            name: chapterModelData.name,
            price: chapterModelData.price,
            subjectVariant: chapterModelData.subjectVariant?.toString() ||
                chapterModelData.subjectVariant,
            isDeleted: chapterModelData.isDeleted,
        });
    }
    static toPersistence(chapterEntity) {
        return {
            icon: {
                url: chapterEntity.icon.url,
                publicId: chapterEntity.icon.publicId,
            },
            name: chapterEntity.name,
            price: chapterEntity.price,
            subjectVariant: chapterEntity.subjectVariant,
            isDeleted: chapterEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=chapter.mapper.js.map