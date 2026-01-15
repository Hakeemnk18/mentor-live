import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js"; 
import { Subject } from "../../entities/subject.entity.js";

export interface IGetSubjectsForAdminUseCase {
  execute(dto: GetAllQueryDto): Promise<{ data: Subject[]; total: number }>;
}