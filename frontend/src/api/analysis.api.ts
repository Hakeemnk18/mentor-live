import axiosInstance from "./axios.instance";
import type { DashboardMotivationSummary } from "../types/admin.type"; 
// ^ Adjust import paths as necessary for your types

export const getAnalysisKpiCards = async () => {
  const res = await axiosInstance.get("/analysis/analysis-kpi-cards");
  // Returns the array of KPI data
  return res.data.data;
};

export const getAnalysisMotivation = async (): Promise<DashboardMotivationSummary> => {
  const res = await axiosInstance.get("/analysis/analysis-motivation");
  // Returns the motivation summary object
  return res.data.data;
};

export const getAnalysisTable = async () => {
  const res = await axiosInstance.get("/analysis/analysis-table");
  // Returns the faculties and chapters table data
  return res.data.data;
};