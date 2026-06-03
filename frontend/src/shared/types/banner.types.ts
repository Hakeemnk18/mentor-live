export interface BannerImage {
  url: string;
  publicId: string;
}

export interface Banner {
  id: string;
  image: BannerImage;
  description: string;
  priority: number | null;
  isShow: boolean;
  isDeleted: boolean;
}

export interface BannerPayload {
  image: BannerImage;
  description: string;
  priority?: number | null;
  isShow: boolean;
}

export interface GetBannersAdminParams {
  page?: number;
  limit?: number;
  search?: string;
  isShow?: boolean;
  sort?: string;
}

export interface GetBannersAdminResult {
  data: Banner[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface UserBanner {
  image: string;
  description: string;
  priority: number | null;
}
