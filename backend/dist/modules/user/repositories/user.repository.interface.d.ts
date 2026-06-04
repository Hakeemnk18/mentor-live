import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { User } from "../entities/user.entity.js";
export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findAllPaginated(allDoc: IGetAllDocDB): Promise<User[]>;
    countDocument(query: Record<string, any>): Promise<number>;
}
//# sourceMappingURL=user.repository.interface.d.ts.map