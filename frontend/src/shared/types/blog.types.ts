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
