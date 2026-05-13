import axiosInstance from "./axios.instance";

import type { Banner, BannerPayload } from "../shared/types/banner.types";
export const getBanners = async (): Promise<Banner[]> => {
  const res = await axiosInstance.get("/banners");
  return res.data.data ?? [];
};

export const createBanner = async (payload: BannerPayload): Promise<void> => {
  await axiosInstance.post("/banners", payload);
};

export const updateBanner = async (
  id: string,
  payload: BannerPayload
): Promise<void> => {
  await axiosInstance.put(`/banners/${id}`, payload);
};

export const deleteBanner = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/banners/${id}`);
};
