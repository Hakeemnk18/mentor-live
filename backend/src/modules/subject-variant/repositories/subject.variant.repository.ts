import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { SubjectVariant } from "../entities/subject.variant.entity.js";
import { SubjectVariantModel } from "../infrastructure/subject.variant.schema.js";
import { SubjectVariantMapper } from "../mappers/subject.variant.mapper.js";
import type { ISubjectVariantRepository } from "./subject.variant.repository.interface.js";

export class SubjectVariantRepository implements ISubjectVariantRepository {
  async create(entity: SubjectVariant): Promise<SubjectVariant> {
    const persistenceData = SubjectVariantMapper.toPersistence(entity);
    const created = await SubjectVariantModel.create(persistenceData);

    const domain = SubjectVariantMapper.toDomain(created);
    if (!domain) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domain;
  }

  async findById(id: string): Promise<SubjectVariant | null> {
    const found = await SubjectVariantModel.findOne({ _id: id }).lean();
    return SubjectVariantMapper.toDomain(found);
  }

  async findByCombination(
    subjectId: string,
    classId: string,
    syllabusId: string
  ): Promise<SubjectVariant | null> {
    const found = await SubjectVariantModel.findOne({
      subject: subjectId,
      class: classId,
      syllabus: syllabusId,
    }).lean();

    return SubjectVariantMapper.toDomain(found);
  }

  async save(entity: SubjectVariant): Promise<SubjectVariant> {
    if (!entity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = SubjectVariantMapper.toPersistence(entity);

    const updated = await SubjectVariantModel.findByIdAndUpdate(
      entity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updated) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domain = SubjectVariantMapper.toDomain(updated);
    if (!domain) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domain;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<SubjectVariant[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await SubjectVariantModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(SubjectVariantMapper.toDomain)
      .filter((v): v is SubjectVariant => v !== null);
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await SubjectVariantModel.countDocuments(query);
  }
}
