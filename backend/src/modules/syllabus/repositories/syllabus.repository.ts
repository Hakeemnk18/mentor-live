import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Syllabus } from "../entities/syllabus.entity.js";
import { SyllabusModel } from "../infrastructure/syllabus.schema.js";
import { SyllabusMapper } from "../mappers/syllabus.mapper.js";
import type { ISyllabusRepository } from "./syllabus.repository.interface.js";

export class SyllabusRepository implements ISyllabusRepository {
  async create(syllabusEntity: Syllabus): Promise<Syllabus> {
    const persistenceData = SyllabusMapper.toPersistence(syllabusEntity);
    const created = await SyllabusModel.create(persistenceData);

    const domainSyllabus = SyllabusMapper.toDomain(created);
    if (!domainSyllabus) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainSyllabus;
  }

  async findById(id: string): Promise<Syllabus | null> {
    const foundDocument = await SyllabusModel.findOne({ _id: id }).lean();
    return SyllabusMapper.toDomain(foundDocument);
  }

  async findByName(name: string): Promise<Syllabus | null> {
    const foundDocument = await SyllabusModel.findOne({ name }).lean();
    return SyllabusMapper.toDomain(foundDocument);
  }

  async save(syllabusEntity: Syllabus): Promise<Syllabus> {
    if (!syllabusEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = SyllabusMapper.toPersistence(syllabusEntity);

    const updatedDocument = await SyllabusModel.findByIdAndUpdate(
      syllabusEntity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.SYLLABUS_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domainSyllabus = SyllabusMapper.toDomain(updatedDocument);
    if (!domainSyllabus) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainSyllabus;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Syllabus[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await SyllabusModel.find(query)
      .sort(sort)
      .collation({ locale: "en", strength: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(SyllabusMapper.toDomain)
      .filter((s): s is Syllabus => s !== null);
  }

  async findAllForUser(): Promise<{ id: string; name: string }[]> {
    const documents = await SyllabusModel.find({ isDeleted: false })
      .select({ _id: 1, name: 1 })
      .lean();

    return documents.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
    }));
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await SyllabusModel.countDocuments(query);
  }
}
