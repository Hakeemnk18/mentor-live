import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import type { ITestimonialController } from "./interfaces/testimonial.controller.interface.js";
import type { ICreateTestimonialUseCase } from "../use-cases/interfaces/create.testimonial.use-case.interface.js";
import type { IEditTestimonialUseCase } from "../use-cases/interfaces/edit.testimonial.use-case.interface.js";
import type { IDeleteTestimonialUseCase } from "../use-cases/interfaces/delete.testimonial.use-case.interface.js";
import type { IGetAllTestimonialUseCase } from "../use-cases/interfaces/get.all.testimonial.use-case.interface.js";
import { CreateTestimonialSchema, type CreateTestimonialRequestDto } from "../dto/create.testimonial.dto.js";



@injectable()
export class TestimonialController implements ITestimonialController {
  constructor(
    @inject("ICreateTestimonialUseCase")
    private readonly _createTestimonialUseCase: ICreateTestimonialUseCase,

    @inject("IEditTestimonialUseCase")
    private readonly _editTestimonialUseCase: IEditTestimonialUseCase,

    @inject("IDeleteTestimonialUseCase")
    private readonly _deleteTestimonialUseCase: IDeleteTestimonialUseCase,

    @inject("IGetAllTestimonialUseCase")
    private readonly _getAllTestimonialUseCase: IGetAllTestimonialUseCase
  ) {}

  async createTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateTestimonialRequestDto = CreateTestimonialSchema.parse(req.body);

      await this._createTestimonialUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.TESTIMONIAL_CREATED,
      });
    } catch (error) {
      console.log("Error in create Testimonial:", error);
      handleError(res, error);
    }
  }

  async editTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      const dto: CreateTestimonialRequestDto = CreateTestimonialSchema.parse(req.body);

      await this._editTestimonialUseCase.execute(id!, dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.TESTIMONIAL_UPDATED,
      });
    } catch (error) {
      console.log("Error in edit testimonial :", error);
      handleError(res, error);
    }
  }

  async deleteTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      await this._deleteTestimonialUseCase.execute(id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.TESTIMONIAL_DELETED,
      });
    } catch (error) {
      console.log("Error in delete testimonial :", error);
      handleError(res, error);
    }
  }

  async getAllTestimonialForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._getAllTestimonialUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
      });
    } catch (error) {
      console.log("Error in get testimonial for admin:", error);
      handleError(res, error);
    }
  }

  async getAllTestimonialForUser(req: Request, res: Response): Promise<void> {
    try {
      const testimonials = await this._getAllTestimonialUseCase.execute();

      //  User-specific response mapping
      const data = testimonials.map((testimonial) => ({
        comment: testimonial.comment,
        designation: testimonial.designation,
        author: testimonial.author
      }));

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
      });
    } catch (error) {
      console.log("Error in get testimonial for user:", error);
      handleError(res, error);
    }
  }
}
