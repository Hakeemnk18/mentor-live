import { z } from "zod";

export const AnalysisChartRangeSchema = z.enum([
  "Year",
  "Month",
  "Week",
  "Daily",
]);

export const GetAnalysisChartQuerySchema = z
  .object({
    range: AnalysisChartRangeSchema,
  })
  .strict();

/* ---------- DTO Type ---------- */

export type GetAnalysisChartQueryDto = z.infer<
  typeof GetAnalysisChartQuerySchema
>;
