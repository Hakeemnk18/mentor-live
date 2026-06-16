import { z } from "zod";

/** Max rows returned by any "export all matching filters" endpoint. */
export const EXPORT_MAX_ROWS = 10000;

export const ExportFormatSchema = z.object({
  format: z.enum(["csv"]).optional().default("csv"),
});

export type ExportFormatDto = z.infer<typeof ExportFormatSchema>;
