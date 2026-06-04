import type { IClassRepository } from "../repositories/class.repository.interface.js";
import { Class } from "../entities/class.entity.js";
import type { IGetClassesForAdminUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
export declare class GetClassesForAdminUseCase implements IGetClassesForAdminUseCase {
    private readonly _classRepository;
    constructor(_classRepository: IClassRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: Class[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.d.ts.map