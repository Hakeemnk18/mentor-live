import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { User } from "../entities/user.entity.js";
import { UserModel } from "../infrastructure/user.schema.js";
import { UserMapper } from "../mappers/user.mapper.js";
export class UserRepository {
    async create(user) {
        const persistenceData = UserMapper.toPersistence(user);
        const created = await UserModel.create(persistenceData);
        const domainUser = UserMapper.toDomain(created);
        if (!domainUser) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainUser;
    }
    async findByEmail(email) {
        const users = await UserModel.find({}).lean();
        console.log("users", users);
        const foundDocument = await UserModel.findOne({
            email: email.toLowerCase(),
        }).lean();
        return UserMapper.toDomain(foundDocument);
    }
    async findById(id) {
        const foundDocument = await UserModel.findOne({ _id: id }).lean();
        return UserMapper.toDomain(foundDocument);
    }
    async findAll() {
        const documents = await UserModel.find({}).lean();
        return documents
            .map((doc) => UserMapper.toDomain(doc))
            .filter((u) => u !== null);
    }
    async findAllPaginated(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await UserModel.find(query)
            .sort(sort)
            .collation({ locale: "en", strength: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map((doc) => UserMapper.toDomain(doc))
            .filter((u) => u !== null);
    }
    async countDocument(query) {
        return UserModel.countDocuments(query);
    }
    async save(user) {
        if (!user.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = UserMapper.toPersistence(user);
        const updatedDocument = await UserModel.findByIdAndUpdate(user.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainUser = UserMapper.toDomain(updatedDocument);
        if (!domainUser) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainUser;
    }
}
//# sourceMappingURL=user.repository.js.map