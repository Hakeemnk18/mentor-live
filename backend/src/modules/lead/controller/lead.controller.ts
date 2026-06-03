import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";

import type { ILeadController } from "./interfaces/lead.controller.interface.js";
import type { ICreateLeadUseCase } from "../use-cases/interfaces/create.lead.use-case.interface.js";
import type { IGetAllLeadsUseCase } from "../use-cases/interfaces/get.all.leads.use-case.interface.js";
import type { IUpdateLeadStatusUseCase } from "../use-cases/interfaces/update.lead.status.use-case.interface.js";

import { CreateLeadSchema } from "../dto/create.lead.dto.js";
import { UpdateLeadStatusSchema } from "../dto/update.lead.status.dto.js";

@injectable()
export class LeadController implements ILeadController {
  constructor(
    @inject("ICreateLeadUseCase")
    private readonly _createLeadUseCase: ICreateLeadUseCase,

    @inject("IGetAllLeadsUseCase")
    private readonly _getAllLeadsUseCase: IGetAllLeadsUseCase,

    @inject("IUpdateLeadStatusUseCase")
    private readonly _updateLeadStatusUseCase: IUpdateLeadStatusUseCase,
  ) {}

  async createLead(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateLeadSchema.parse(req.body);
      await this._createLeadUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Your request has been submitted. We'll get in touch soon!",
      });
    } catch (error) {
      console.log("Error in createLead:", error);
      handleError(res, error);
    }
  }

  async getAllLeads(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["type", "status"]),
      );
      const { data, total } = await this._getAllLeadsUseCase.execute(dto);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getAllLeads:", error);
      handleError(res, error);
    }
  }

  async updateLeadStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const { status } = UpdateLeadStatusSchema.parse(req.body);
      await this._updateLeadStatusUseCase.execute(id!, status);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lead status updated",
      });
    } catch (error) {
      console.log("Error in updateLeadStatus:", error);
      handleError(res, error);
    }
  }
}
