import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Lead } from "../entities/lead.entity.js";
import type { ICreateLeadUseCase } from "./interfaces/create.lead.use-case.interface.js";
import type { CreateLeadRequestDto } from "../dto/create.lead.dto.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";

@injectable()
export class CreateLeadUseCase implements ICreateLeadUseCase {
  constructor(
    @inject("ILeadRepository")
    private readonly _leadRepository: ILeadRepository,
  ) {}

  async execute(dto: CreateLeadRequestDto): Promise<void> {
    const lead = new Lead({
      id: null,
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? null,
      message: dto.message ?? null,
      purpose: dto.purpose,
      type: dto.type,
      status: "new",
      classId: dto.classId ?? null,
      syllabusId: dto.syllabusId ?? null,
      className: dto.className ?? null,
      syllabusName: dto.syllabusName ?? null,
    });

    const created = await this._leadRepository.create(lead);

    if (!created) {
      throw new CustomError(
        "Failed to create lead",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
