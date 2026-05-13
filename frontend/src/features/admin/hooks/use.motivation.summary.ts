import { useState, useEffect } from "react";
import { getAnalysisMotivation } from "../../../api/analysis.api";
import type { DashboardMotivationSummary } from "../types/admin.types";

export const useMotivationSummary = () => {
  const [data, setData] = useState<DashboardMotivationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getAnalysisMotivation();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch motivation summary:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotivation();
  }, []);

  return { data, isLoading, isError };
};
