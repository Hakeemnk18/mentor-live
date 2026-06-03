export interface BlogImage {
  url: string;
  publicId: string;
}

export interface Blog {
  id: string;
  slug: string;
  heading: string;
  description: string;
  author: string;
  image: BlogImage | null;
  priority: number | null;
  topic: string | null;
  isFeatured: boolean;
  isDeleted: boolean;
  content?: string;
}

export interface BlogPayload {
  author: string;
  heading: string;
  description: string;
  content: string;
  image?: BlogImage | null;
  priority?: number | null;
  topic?: string | null;
  isFeatured?: boolean;
}

/* ── User list ── */
export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  isFeatured?: boolean;
}

export interface GetBlogsResponse {
  data: Blog[];
  total: number;
  totalPages: number;
  currentPage: number;
  /** @deprecated kept for backward compat with infinite query */
  totalPage: number;
}

/* ── Admin list ── */
export interface GetBlogsAdminParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  isDeleted?: boolean;
  isFeatured?: boolean;
}

export interface GetBlogsAdminResponse {
  data: Blog[];
  total: number;
  totalPages: number;
  currentPage: number;
}
