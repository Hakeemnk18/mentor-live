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
//# sourceMappingURL=get.analysis.chart.dto.js.map