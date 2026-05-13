import axiosInstance from "./axios.instance";

import type { Blog, BlogPayload, GetBlogsParams, GetBlogsResponse } from "../shared/types/blog.types";
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
