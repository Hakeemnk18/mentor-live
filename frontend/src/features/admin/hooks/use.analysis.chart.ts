import { useState, useEffect } from "react";
import { getAnalysisChart } from "../../../api/analysis.api";
import type { AnalysisChartData, BookingChartRange } from "../types/admin.types";

export const useAnalysisChart = (range: BookingChartRange) => {
  const [data, setData] = useState<AnalysisChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getAnalysisChart(range);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analysis chart:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [range]);

  return { data, isLoading, isError };
};
