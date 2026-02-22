import axiosInstance from "./axios.instance";

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

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const res = await axiosInstance.get("/testimonials");
  return res.data.data ?? [];
};

export const createTestimonial = async (
  payload: TestimonialPayload
): Promise<void> => {
  await axiosInstance.post("/testimonials", payload);
};

export const updateTestimonial = async (
  id: string,
  payload: TestimonialPayload
): Promise<void> => {
  await axiosInstance.put(`/testimonials/${id}`, payload);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/testimonials/${id}`);
};
