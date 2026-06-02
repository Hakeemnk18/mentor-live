import { useState, useEffect } from "react";
import { getBookingStatusDistribution } from "../../../api/analysis.api";
import type { BookingStatusDistribution } from "../types/admin.types";

export const useBookingStatus = () => {
  const [data, setData] = useState<BookingStatusDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getBookingStatusDistribution();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch booking status:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return { data, isLoading, isError };
};
