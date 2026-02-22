import axiosInstance from "./axios.instance";

export interface Blog {
  id: string;
  slug: string;
  heading: string;
  description: string;
  author: string;
  isDeleted: boolean;
}

export interface BlogPayload {
  author: string;
  heading: string;
  description: string;
  content: string;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const res = await axiosInstance.get("/blogs");
  return res.data.data ?? [];
};

export const createBlog = async (payload: BlogPayload): Promise<void> => {
  await axiosInstance.post("/blogs", payload);
};

export const updateBlog = async (
  id: string,
  payload: BlogPayload
): Promise<void> => {
  await axiosInstance.put(`/blogs/${id}`, payload);
};

export const blockBlog = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/blogs/${id}/block`);
};

export const unblockBlog = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/blogs/${id}/unblock`);
};
