import { useState, useEffect } from "react";
import { getAnalysisKpiCards } from "../../../api/analysis.api";

// You can import this from where you defined it in the previous step
import type { BackendKpiData } from "../components/DashboardKpiCard"; 

export const useKpiCards = () => {
  const [data, setData] = useState<BackendKpiData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getAnalysisKpiCards();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch KPI cards:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpis();
  }, []);

  return { data, isLoading, isError };
};