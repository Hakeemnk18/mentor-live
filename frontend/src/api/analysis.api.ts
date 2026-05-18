import axiosInstance from "./axios.instance";
import type { DashboardMotivationSummary } from "../features/admin/types/admin.types";
import type { AnalysisChartData, BookingChartRange, BookingStatusDistribution } from "../features/admin/types/admin.types";

export const getAnalysisKpiCards = async () => {
  const res = await axiosInstance.get("/analysis/analysis-kpi-cards");
  // Returns the array of KPI data
  return res.data.data;
};

export const getAnalysisMotivation = async (): Promise<DashboardMotivationSummary> => {
  const res = await axiosInstance.get("/analysis/analysis-motivation");
  return res.data.data;
};

export const getAnalysisTable = async () => {
  const res = await axiosInstance.get("/analysis/analysis-table");
  return res.data.data;
};

export const getAnalysisChart = async (range: BookingChartRange): Promise<AnalysisChartData> => {
  const res = await axiosInstance.get(`/analysis/analysis-chart?range=${range}`);
  return res.data.data;
};

export const getBookingStatusDistribution = async (): Promise<BookingStatusDistribution> => {
  const res = await axiosInstance.get("/analysis/booking-status-distribution");
  return res.data.data;
};