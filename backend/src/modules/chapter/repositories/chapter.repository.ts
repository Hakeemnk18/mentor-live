import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

import { Chapter } from "../entities/chapter.entity.js";
import { ChapterModel } from "../infrastructure/chapter.schema.js";
import { ChapterMapper } from "../mapper/chapter.mapper.js";
import type { IChapterRepository } from "./chapter.repository.interface.js";

export class ChapterRepository implements IChapterRepository {
  async create(chapterEntity: Chapter): Promise<Chapter> {
    const persistenceData = ChapterMapper.toPersistence(chapterEntity);
    const created = await ChapterModel.create(persistenceData);

    const domainChapter = ChapterMapper.toDomain(created);
    if (!domainChapter) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainChapter;
  }

  async findById(id: string): Promise<Chapter | null> {
    const foundDocument = await ChapterModel.findOne({ _id: id }).lean();
    return ChapterMapper.toDomain(foundDocument);
  }

  async findByNameAndVariant(
    name: string,
    subjectVariant: string
  ): Promise<Chapter | null> {
    const foundDocument = await ChapterModel.findOne({
      name,
      subjectVariant,
    }).lean();

    return ChapterMapper.toDomain(foundDocument);
  }

  async save(chapterEntity: Chapter): Promise<Chapter> {
    if (!chapterEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = ChapterMapper.toPersistence(chapterEntity);

    const updatedDocument = await ChapterModel.findByIdAndUpdate(
      chapterEntity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.CHAPTER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domainChapter = ChapterMapper.toDomain(updatedDocument);
    if (!domainChapter) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainChapter;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Chapter[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await ChapterModel.find(query)
      .sort(sort)
      .collation({ locale: "en", strength: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(ChapterMapper.toDomain)
      .filter((c): c is Chapter => c !== null);
  }

  async findAllForUser(
    allDoc: IGetAllDocDB
  ): Promise<{ id: string; name: string; price: number; icon: string }[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await ChapterModel.find({
      ...query,
      isDeleted: false,
    })
      .select({ _id: 1, name: 1, price: 1, icon: 1 })
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return documents.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      icon: doc.icon,
    }));
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await ChapterModel.countDocuments(query);
  }
}
