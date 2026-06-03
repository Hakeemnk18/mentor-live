import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IUpdateLeadStatusUseCase } from "./interfaces/update.lead.status.use-case.interface.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";
import type { LeadStatus } from "../entities/lead.entity.js";

@injectable()
export class UpdateLeadStatusUseCase implements IUpdateLeadStatusUseCase {
  constructor(
    @inject("ILeadRepository")
    private readonly _leadRepository: ILeadRepository,
  ) {}

  async execute(id: string, status: LeadStatus): Promise<void> {
    const existing = await this._leadRepository.findById(id);

    if (!existing) {
      throw new CustomError("Lead not found", HttpStatusCode.NOT_FOUND);
    }

    const updated = existing.updateStatus(status);
    await this._leadRepository.save(updated);
  }
}
