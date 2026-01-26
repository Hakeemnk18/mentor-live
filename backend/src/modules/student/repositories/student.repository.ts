import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Student } from "../entities/student.entity.js";
import { StudentModel } from "../infrastructure/student.schema.js";
import { StudentMapper } from "../mapper/student.mapper.js"; 
import type { IStudentRepository } from "./student.repository.interface.js";

export class StudentRepository implements IStudentRepository {
  async create(studentEntity: Student): Promise<Student> {
    const persistenceData = StudentMapper.toPersistence(studentEntity);
    const created = await StudentModel.create(persistenceData);

    const domainStudent = StudentMapper.toDomain(created);
    if (!domainStudent) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainStudent;
  }

  async findById(id: string): Promise<Student | null> {
    const foundDocument = await StudentModel.findOne({ _id: id }).lean();
    return StudentMapper.toDomain(foundDocument);
  }

  async findByName(name: string): Promise<Student | null> {
    const foundDocument = await StudentModel.findOne({ name }).lean();
    return StudentMapper.toDomain(foundDocument);
  }

  async findByNamePhoneNumber(phoneNumber: string): Promise<Student | null> {
      const foundDocument = await StudentModel.findOne({ phoneNumber }).lean();
    return StudentMapper.toDomain(foundDocument);
  }

  async save(studentEntity: Student): Promise<Student> {
    if (!studentEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = StudentMapper.toPersistence(studentEntity);

    const updatedDocument = await StudentModel.findByIdAndUpdate(
      studentEntity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.STUDENT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domainStudent = StudentMapper.toDomain(updatedDocument);
    if (!domainStudent) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainStudent;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Student[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await StudentModel.find(query)
      .sort(sort)
      .collation({ locale: "en", strength: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(StudentMapper.toDomain)
      .filter((s): s is Student => s !== null);
  }

  async findAllForUser(): Promise<{ id: string; name: string }[]> {
    const documents = await StudentModel.find({ isDeleted: false })
      .select({ _id: 1, name: 1 })
      .lean();

    return documents.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
    }));
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await StudentModel.countDocuments(query);
  }
}
