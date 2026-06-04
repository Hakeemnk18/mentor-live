import { z } from "zod";
export declare const AnalysisChartRangeSchema: z.ZodEnum<{
    Daily: "Daily";
    Week: "Week";
    Month: "Month";
    Year: "Year";
}>;
export declare const GetAnalysisChartQuerySchema: z.ZodObject<{
    range: z.ZodEnum<{
        Daily: "Daily";
        Week: "Week";
        Month: "Month";
        Year: "Year";
    }>;
}, z.core.$strict>;
export type GetAnalysisChartQueryDto = z.infer<typeof GetAnalysisChartQuerySchema>;
//# sourceMappingURL=get.analysis.chart.dto.d.ts.map