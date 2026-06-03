import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";

import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Lead } from "../entities/lead.entity.js";
import { LeadModel } from "../infrastructure/lead.schema.js";
import { LeadMapper } from "../mapper/lead.mapper.js";
import type { LeadListItem } from "../type/lead.type.js";
import type { ILeadRepository } from "./lead.repository.interface.js";

export class LeadRepository implements ILeadRepository {
  async create(lead: Lead): Promise<Lead> {
    const persistenceData = LeadMapper.toPersistence(lead);
    const created = await LeadModel.create(persistenceData);
    const domain = LeadMapper.toDomain(created);

    if (!domain) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domain;
  }

  async findById(id: string): Promise<Lead | null> {
    const doc = await LeadModel.findOne({ _id: id }).lean();
    return LeadMapper.toDomain(doc);
  }

  async save(lead: Lead): Promise<Lead> {
    if (!lead.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = LeadMapper.toPersistence(lead);

    const updated = await LeadModel.findByIdAndUpdate(
      lead.id,
      { $set: persistenceData },
      { new: true },
    ).lean();

    if (!updated) {
      throw new CustomError(
        "Lead not found",
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domain = LeadMapper.toDomain(updated);
    if (!domain) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domain;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<LeadListItem[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await LeadModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(LeadMapper.toListItem)
      .filter((l): l is LeadListItem => l !== null);
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return LeadModel.countDocuments(query);
  }
}
