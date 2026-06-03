import type { LeadStatus } from "../../entities/lead.entity.js";

export interface IUpdateLeadStatusUseCase {
  execute(id: string, status: LeadStatus): Promise<void>;
}
