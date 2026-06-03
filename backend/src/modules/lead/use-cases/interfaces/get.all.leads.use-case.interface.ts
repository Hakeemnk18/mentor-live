import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { LeadListItem } from "../../type/lead.type.js";

export interface IGetAllLeadsUseCase {
  execute(dto: GetAllQueryDto): Promise<{ data: LeadListItem[]; total: number }>;
}
