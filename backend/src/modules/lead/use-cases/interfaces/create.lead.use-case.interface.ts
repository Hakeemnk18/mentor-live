import type { CreateLeadRequestDto } from "../../dto/create.lead.dto.js";

export interface ICreateLeadUseCase {
  execute(dto: CreateLeadRequestDto): Promise<void>;
}
