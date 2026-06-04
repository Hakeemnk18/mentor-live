import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Testimonial } from "../entities/testimonial.entity.js";
import type { ITestimonialRepository } from "./testimonial.repository.interface.js";
export declare class TestimonialRepository implements ITestimonialRepository {
    create(testimonialEntity: Testimonial): Promise<Testimonial>;
    findById(id: string): Promise<Testimonial | null>;
    save(testimonialEntity: Testimonial): Promise<Testimonial>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Testimonial[]>;
    findAllForUser(): Promise<Testimonial[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    deleteById(id: string): Promise<void>;
    findByAuthor(name: string): Promise<Testimonial | null>;
}
//# sourceMappingURL=testimonial.repository.d.ts.map