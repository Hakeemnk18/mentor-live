import { Testimonial } from "../entities/testimonial.entity.js";

export class TestimonialMapper {
  static toDomain(testimonialModelData: any): Testimonial | null {
    if (!testimonialModelData) {
      return null;
    }

    const idString =
      testimonialModelData._id?.toString() ||
      testimonialModelData.id?.toString();

    if (!idString) {
      console.error(
        "Testimonial data from DB is missing an ID:",
        testimonialModelData
      );
      return null;
    }

    return new Testimonial({
      id: idString,
      author: testimonialModelData.author,
      designation: testimonialModelData.designation,
      comment: testimonialModelData.comment,
      isDeleted: testimonialModelData.isDeleted,
    });
  }

  static toPersistence(testimonialEntity: Testimonial): any {
    return {
      author: testimonialEntity.author,
      designation: testimonialEntity.designation,
      comment: testimonialEntity.comment,
      isDeleted: testimonialEntity.isDeleted,
    };
  }
}
