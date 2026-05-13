export interface Testimonial {
  id: string;
  author: string;
  designation: string;
  comment: string;
  isDeleted: boolean;
}

export interface TestimonialPayload {
  author: string;
  designation: string;
  comment: string;
}
