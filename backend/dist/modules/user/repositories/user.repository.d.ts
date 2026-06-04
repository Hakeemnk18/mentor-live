import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { User } from "../entities/user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";
export declare class UserRepository implements IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findAllPaginated(allDoc: IGetAllDocDB): Promise<User[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    save(user: User): Promise<User>;
}
//# sourceMappingURL=user.repository.d.ts.map