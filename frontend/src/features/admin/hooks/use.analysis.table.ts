import { useState, useEffect } from "react";
import { getAnalysisTable } from "../../../api/analysis.api"; 
import type { AnalysisTableData } from "../types/admin.types";

export const useAnalysisTable = () => {
  const [data, setData] = useState<AnalysisTableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getAnalysisTable();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analysis table:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTable();
  }, []);

  return { data, isLoading, isError };
};