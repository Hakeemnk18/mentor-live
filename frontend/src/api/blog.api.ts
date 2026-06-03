import axiosInstance from "./axios.instance";

import type {
  Blog,
  BlogPayload,
  GetBlogsParams,
  GetBlogsResponse,
  GetBlogsAdminParams,
  GetBlogsAdminResponse,
} from "../shared/types/blog.types";

/** User-facing blog list (non-deleted only) */
export const getBlogs = async (params?: GetBlogsParams): Promise<GetBlogsResponse> => {
  const res = await axiosInstance.get("/blogs/list", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    totalPages: d.totalPages ?? 1,
    currentPage: d.currentPage ?? 1,
    totalPage: d.totalPage ?? d.total ?? 0,
  };
};

/** Featured blogs sorted by priority — landing page */
export const getFeaturedBlogs = async (): Promise<Blog[]> => {
  const res = await axiosInstance.get("/blogs/list", {
    params: { isFeatured: true, sort: "priority", limit: 9 },
  });
  return res.data.data ?? [];
};

/** Admin blog list (all blogs including deleted) */
export const getBlogsAdmin = async (
  params: GetBlogsAdminParams,
): Promise<GetBlogsAdminResponse> => {
  const res = await axiosInstance.get("/blogs", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    totalPages: d.totalPages ?? 1,
    currentPage: d.currentPage ?? 1,
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
  payload: BlogPayload,
): Promise<void> => {
  await axiosInstance.put(`/blogs/${id}`, payload);
};

export const blockBlog = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/blogs/${id}/block`);
};

export const unblockBlog = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/blogs/${id}/unblock`);
};
