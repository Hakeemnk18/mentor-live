import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";

import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Testimonial } from "../entities/testimonial.entity.js";
import { TestimonialModel } from "../infrastructure/testimonial.schema.js";
import { TestimonialMapper } from "../mapper/testimonial.mapper.js";

import type { ITestimonialRepository } from "./testimonial.repository.interface.js";

export class TestimonialRepository implements ITestimonialRepository {
  async create(testimonialEntity: Testimonial): Promise<Testimonial> {
    const persistenceData = TestimonialMapper.toPersistence(testimonialEntity);

    const created = await TestimonialModel.create(persistenceData);
    const domainTestimonial = TestimonialMapper.toDomain(created);

    if (!domainTestimonial) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainTestimonial;
  }

  async findById(id: string): Promise<Testimonial | null> {
    const foundDocument = await TestimonialModel.findOne({ _id: id }).lean();
    return TestimonialMapper.toDomain(foundDocument);
  }

  async save(testimonialEntity: Testimonial): Promise<Testimonial> {
    if (!testimonialEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = TestimonialMapper.toPersistence(testimonialEntity);

    const updatedDocument = await TestimonialModel.findByIdAndUpdate(
      testimonialEntity.id,
      { $set: persistenceData },
      { new: true },
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domainTestimonial = TestimonialMapper.toDomain(updatedDocument);
    if (!domainTestimonial) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainTestimonial;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Testimonial[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await TestimonialModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(TestimonialMapper.toDomain)
      .filter((t): t is Testimonial => t !== null);
  }

  async findAllForUser(): Promise<Testimonial[]> {
    const documents = await TestimonialModel.find({}).lean();

    return documents
      .map(TestimonialMapper.toDomain)
      .filter((t): t is Testimonial => t !== null);
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return TestimonialModel.countDocuments(query);
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await TestimonialModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
  }

  async findByAuthor(name: string): Promise<Testimonial | null> {
    const foundDocument = await TestimonialModel.findOne({ author: name }).lean();
    return TestimonialMapper.toDomain(foundDocument);
  }
}