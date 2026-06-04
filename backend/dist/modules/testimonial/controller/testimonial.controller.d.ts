import type { Request, Response } from "express";
import type { ITestimonialController } from "./interfaces/testimonial.controller.interface.js";
import type { ICreateTestimonialUseCase } from "../use-cases/interfaces/create.testimonial.use-case.interface.js";
import type { IEditTestimonialUseCase } from "../use-cases/interfaces/edit.testimonial.use-case.interface.js";
import type { IDeleteTestimonialUseCase } from "../use-cases/interfaces/delete.testimonial.use-case.interface.js";
import type { IGetAllTestimonialUseCase } from "../use-cases/interfaces/get.all.testimonial.use-case.interface.js";
export declare class TestimonialController implements ITestimonialController {
    private readonly _createTestimonialUseCase;
    private readonly _editTestimonialUseCase;
    private readonly _deleteTestimonialUseCase;
    private readonly _getAllTestimonialUseCase;
    constructor(_createTestimonialUseCase: ICreateTestimonialUseCase, _editTestimonialUseCase: IEditTestimonialUseCase, _deleteTestimonialUseCase: IDeleteTestimonialUseCase, _getAllTestimonialUseCase: IGetAllTestimonialUseCase);
    createTestimonial(req: Request, res: Response): Promise<void>;
    editTestimonial(req: Request, res: Response): Promise<void>;
    deleteTestimonial(req: Request, res: Response): Promise<void>;
    getAllTestimonialForAdmin(req: Request, res: Response): Promise<void>;
    getAllTestimonialForUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=testimonial.controller.d.ts.map