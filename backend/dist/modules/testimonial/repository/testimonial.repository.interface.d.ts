import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Testimonial } from "../entities/testimonial.entity.js";
export interface ITestimonialRepository {
    create(testimonialEntity: Testimonial): Promise<Testimonial>;
    findById(id: string): Promise<Testimonial | null>;
    save(testimonialEntity: Testimonial): Promise<Testimonial>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Testimonial[]>;
    findAllForUser(): Promise<Testimonial[]>;
    findByAuthor(name: string): Promise<Testimonial | null>;
    countDocument(query: Record<string, any>): Promise<number>;
    deleteById(id: string): Promise<void>;
}
//# sourceMappingURL=testimonial.repository.interface.d.ts.map