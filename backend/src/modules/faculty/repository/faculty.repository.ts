import { Types } from "mongoose";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import { Faculty } from "../entities/faculty.entity.js";
import { FacultyModel } from "../infrastructure/faculty.schema.js";
import { FacultyMapper } from "../mapper/faculty.mapper.js";
import type { IFacultyRepository } from "./faculty.repository.interface.js";
import type { FacultyFullAdminView, FacultyPopulatedLean, FacultyView } from "../types/faculty.type.js";

const { ObjectId } = Types;

export class FacultyRepository implements IFacultyRepository {
  async create(facultyEntity: Faculty): Promise<Faculty> {
    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const created = await FacultyModel.create(persistenceData);

    const domainFaculty = FacultyMapper.toDomain(created);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
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
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const updatedDocument = await FacultyModel.findByIdAndUpdate(
      facultyEntity.id,
      { $set: persistenceData },
      { new: true },
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domainFaculty = FacultyMapper.toDomain(updatedDocument);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainFaculty;
  }

  async findAllFacultyForAdmin(
    allDoc: AcademicListFiltersBase,
  ): Promise<{ data: FacultyView[]; total: number }> {
    const { page, limit, classId, syllabusId, subjectId, search, sort } =
      allDoc;
    const skip = (page - 1) * limit;

    const documents = await FacultyModel.aggregate([
      {
        $match: {
          isDeleted: false,
          ...(search && {
            name: { $regex: search, $options: "i" },
          }),
        },
      },
      { $unwind: "$subjectOffering" },
      {
        $lookup: {
          from: "subjectvariants",
          localField: "subjectOffering",
          foreignField: "_id",
          as: "sv",
        },
      },

      { $unwind: "$sv" },

      {
        $match: {
          ...(classId && { "sv.subject": new ObjectId(classId) }),
          ...(syllabusId && { "sv.subject": new ObjectId(syllabusId) }),
          ...(subjectId && { "sv.subject": new ObjectId(subjectId) }),
        },
      },
      {
        $facet: {
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                price: 1,
                image: 1,
                qualifications: 1,
                demoClass: 1,
                description: 1,
                createdAt: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = documents[0]?.data ?? [];
    const total = documents[0]?.totalCount[0]?.count ?? 0;

    const faculties = data.map(FacultyMapper.toView);

    return {
      data: faculties,
      total,
    };
  }

  async findFacultyFullByIdForAdmin(
    id: string,
  ): Promise<FacultyFullAdminView | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await FacultyModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    })
      .populate({
        path: "subjectOffering",
        populate: [
          { path: "class", select: "name" },
          { path: "syllabus", select: "name" },
          { path: "subject", select: "name" },
        ],
      })
      .populate({
        path: "chapterSlots.chapter",
        select: "name",
      })
      .populate({
        path: "slots.pool",
        select: "_id",
      })
      .populate({
        path: "chapterSlots.pool",
        select: "_id",
      })
      .lean<FacultyPopulatedLean>();

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications,
      description: doc.description,
      demoClass: doc.demoClass,
      image: doc.image.url,
      price: doc.price,
      isDeleted: doc.isDeleted,

      slots: doc.slots.map((s) => ({
        id: s._id.toString(),
        time: s.time.toISOString().slice(11, 16), 
        isAvailable: s.isAvailable,
        pool: s.pool.map((u: any) => ({ id: u._id.toString() })),
        poolLimit: s.poolLimit
      })),

      chapterSlots: doc.chapterSlots.map((c) => ({
        id: c._id.toString(),
        isAvailable: c.isAvailable,
        chapter: {
          id: c.chapter._id.toString(),
          name: c.chapter.name,
        },
        pool: c.pool.map((u: any) => ({ id: u._id.toString() })),
        poolLimit: c.poolLimit
      })),

      subjectOffering: doc.subjectOffering.map((so: any) => ({
        id: so._id.toString(),
        class: {
          id: so.class._id.toString(),
          name: so.class.name,
        },
        syllabus: {
          id: so.syllabus._id.toString(),
          name: so.syllabus.name,
        },
        subject: {
          id: so.subject._id.toString(),
          name: so.subject.name,
        },
      })),
    };
  }
}
