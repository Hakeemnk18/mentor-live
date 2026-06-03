import axiosInstance from "./axios.instance";
import type {
  Banner,
  BannerPayload,
  GetBannersAdminParams,
  GetBannersAdminResult,
  UserBanner,
} from "../shared/types/banner.types";

export const getBannersAdmin = async (
  params: GetBannersAdminParams,
): Promise<GetBannersAdminResult> => {
  const res = await axiosInstance.get("/banners", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    currentPage: d.currentPage ?? 1,
    totalPages: d.totalPages ?? 1,
  };
};

/** @deprecated use getBannersAdmin */
export const getBanners = async (): Promise<Banner[]> => {
  const res = await axiosInstance.get("/banners");
  return res.data.data ?? [];
};

export const getUserBanners = async (): Promise<UserBanner[]> => {
  const res = await axiosInstance.get("/banners/list");
  return res.data.data ?? [];
};

export const createBanner = async (payload: BannerPayload): Promise<void> => {
  await axiosInstance.post("/banners", payload);
};

export const updateBanner = async (
  id: string,
  payload: BannerPayload,
): Promise<void> => {
  await axiosInstance.put(`/banners/${id}`, payload);
};

export const deleteBanner = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/banners/${id}`);
};

export const toggleBannerShow = async (
  id: string,
  isShow: boolean,
  priority?: number,
): Promise<void> => {
  await axiosInstance.patch(`/banners/${id}/toggle-show`, { isShow, priority });
};
