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

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: boolean;
}

export interface GetBlogsResponse {
  data: Blog[];
  totalPage: number;
}

export const getBlogs = async (params?: GetBlogsParams): Promise<GetBlogsResponse> => {
  const res = await axiosInstance.get("/blogs/list", { params });
  return {
    data: res.data.data ?? [],
    totalPage: res.data.totalPage ?? 1,
  };
};

export const getBlogById = async (id: string): Promise<Blog & { content?: string }> => {
  const res = await axiosInstance.get(`/blogs/${id}`);
  return res.data.data;
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
