import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";

import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Banner } from "../entities/banner.entity.js";
import { BannerModel } from "../infrastructure/banner.schema.js";
import { BannerMapper } from "../mapper/banner.mapper.js";

import type { IBannerRepository } from "./banner.repository.interface.js";

export class BannerRepository implements IBannerRepository {
  async create(bannerEntity: Banner): Promise<Banner> {
    const persistenceData = BannerMapper.toPersistence(bannerEntity);

    const created = await BannerModel.create(persistenceData);
    const domainBanner = BannerMapper.toDomain(created);

    if (!domainBanner) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainBanner;
  }

  async findById(id: string): Promise<Banner | null> {
    const foundDocument = await BannerModel.findOne({ _id: id }).lean();
    return BannerMapper.toDomain(foundDocument);
  }

  async save(bannerEntity: Banner): Promise<Banner> {
    if (!bannerEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = BannerMapper.toPersistence(bannerEntity);

    const updatedDocument = await BannerModel.findByIdAndUpdate(
      bannerEntity.id,
      { $set: persistenceData },
      { new: true },
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domainBanner = BannerMapper.toDomain(updatedDocument);
    if (!domainBanner) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainBanner;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Banner[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await BannerModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(BannerMapper.toDomain)
      .filter((b): b is Banner => b !== null);
  }

  async findAllForUser(): Promise<Banner[]> {
    const documents = await BannerModel.find({}).sort({ priority: 1 }).lean();

    return documents
      .map(BannerMapper.toDomain)
      .filter((b): b is Banner => b !== null);
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return BannerModel.countDocuments(query);
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await BannerModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
  }

  async getAllPriorities(): Promise<number[]> {
    const documents = await BannerModel.find({})
      .select({ priority: 1, _id: 0 })
      .lean();

    return documents.map((doc) => doc.priority);
  }
}
