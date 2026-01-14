import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Subject } from "../entities/subject.entity.js";
import { SubjectModel } from "../infrastructure/subject.schema.js";
import { SubjectMapper } from "../mappers/subject.mapper.js";
import type { ISubjectRepository } from "./subject.repository.interface.js";

export class SubjectRepository implements ISubjectRepository {
  async create(subjectEntity: Subject): Promise<Subject> {
    const persistenceData = SubjectMapper.toPersistence(subjectEntity);
    const created = await SubjectModel.create(persistenceData);

    const domainSubject = SubjectMapper.toDomain(created);
    if (!domainSubject) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainSubject;
  }

  async findById(id: string): Promise<Subject | null> {
    const foundDocument = await SubjectModel.findOne({ _id: id }).lean();
    return SubjectMapper.toDomain(foundDocument);
  }

  async findByName(name: string): Promise<Subject | null> {
    const foundDocument = await SubjectModel.findOne({ name }).lean();
    return SubjectMapper.toDomain(foundDocument);
  }

  async save(subjectEntity: Subject): Promise<Subject> {
    if (!subjectEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = SubjectMapper.toPersistence(subjectEntity);

    const updatedDocument = await SubjectModel.findByIdAndUpdate(
      subjectEntity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.SUBJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domainSubject = SubjectMapper.toDomain(updatedDocument);
    if (!domainSubject) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainSubject;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Subject[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await SubjectModel.find(query)
      .sort(sort)
      .collation({ locale: "en", strength: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(SubjectMapper.toDomain)
      .filter((s): s is Subject => s !== null);
  }

  async findAllForUser(): Promise<{ id: string; name: string }[]> {
    const documents = await SubjectModel.find({ isDeleted: false })
      .select({ _id: 1, name: 1 })
      .lean();

    return documents.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
    }));
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await SubjectModel.countDocuments(query);
  }
}
