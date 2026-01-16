import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Faculty } from "../entities/faculty.entity.js"; 
import { FacultyModel } from "../infrastructure/faculty.schema.js";
import { FacultyMapper } from "../mapper/faculty.mapper.js"; 
import type { IFacultyRepository } from "./faculty.repository.interface.js";

export class FacultyRepository implements IFacultyRepository {
  async create(facultyEntity: Faculty): Promise<Faculty> {
    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const created = await FacultyModel.create(persistenceData);

    const domainFaculty = FacultyMapper.toDomain(created);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainFaculty;
  }

  async findById(id: string): Promise<Faculty | null> {
    const foundDocument = await FacultyModel.findOne({ _id: id }).lean();
    return FacultyMapper.toDomain(foundDocument);
  }

  async findByName(name: string): Promise<Faculty | null> {
    const foundDocument = await FacultyModel.findOne({ name }).lean();
    return FacultyMapper.toDomain(foundDocument);
  }

  async save(facultyEntity: Faculty): Promise<Faculty> {
    if (!facultyEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const updatedDocument = await FacultyModel.findByIdAndUpdate(
      facultyEntity.id,
      { $set: persistenceData },
      { new: true }
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const domainFaculty = FacultyMapper.toDomain(updatedDocument);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return domainFaculty;
  }
}
