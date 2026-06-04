import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Student } from "../entities/student.entity.js";
import { StudentModel } from "../infrastructure/student.schema.js";
import { StudentMapper } from "../mapper/student.mapper.js";
export class StudentRepository {
    async create(studentEntity) {
        const persistenceData = StudentMapper.toPersistence(studentEntity);
        const created = await StudentModel.create(persistenceData);
        const domainStudent = StudentMapper.toDomain(created);
        if (!domainStudent) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainStudent;
    }
    async findById(id) {
        const foundDocument = await StudentModel.findOne({ _id: id }).lean();
        return StudentMapper.toDomain(foundDocument);
    }
    async findByName(name) {
        const foundDocument = await StudentModel.findOne({ name }).lean();
        return StudentMapper.toDomain(foundDocument);
    }
    async findByNamePhoneNumber(phoneNumber) {
        const foundDocument = await StudentModel.findOne({ phoneNumber }).lean();
        return StudentMapper.toDomain(foundDocument);
    }
    async save(studentEntity) {
        if (!studentEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = StudentMapper.toPersistence(studentEntity);
        const updatedDocument = await StudentModel.findByIdAndUpdate(studentEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.STUDENT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainStudent = StudentMapper.toDomain(updatedDocument);
        if (!domainStudent) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainStudent;
    }
    async findAllForAdmin(allDoc) {
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
            .filter((s) => s !== null);
    }
    async findAllForUser() {
        const documents = await StudentModel.find({ isDeleted: false })
            .select({ _id: 1, name: 1 })
            .lean();
        return documents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
        }));
    }
    async countDocument(query) {
        return await StudentModel.countDocuments(query);
    }
    async getStudentCountInRange(startDate, endDate) {
        return StudentModel.countDocuments({
            isDeleted: false,
            createdAt: { $gte: startDate, $lte: endDate },
        });
    }
    async getDailyStudentKpiStats(startDate, endDate) {
        return StudentModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
}
//# sourceMappingURL=student.repository.js.map