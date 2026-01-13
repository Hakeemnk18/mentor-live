import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { Class } from "../../entities/class.entity.js";


export interface IGetClassesForAdminUseCase {
  execute(dto: GetAllQueryDto): Promise<{data: Class[], total: number}>;
}