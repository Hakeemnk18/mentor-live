import type { Response } from "express";

export type ExportColumn<T> = {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
};

export type ExportFormat = "csv";

const escapeCsvValue = (value: unknown): string => {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const toCsv = <T>(rows: T[], columns: ExportColumn<T>[]): string => {
  const header = columns.map((c) => escapeCsvValue(c.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvValue(c.value(row))).join(","),
  );
  return [header, ...lines].join("\r\n");
};

/**
 * Sends `rows` to the client as a downloadable export file.
 * Only "csv" is implemented today — to support a new format (e.g. "xlsx",
 * "pdf"), extend `ExportFormat` and add a case below.
 */
export const sendExportFile = <T>(
  res: Response,
  filename: string,
  format: ExportFormat,
  rows: T[],
  columns: ExportColumn<T>[],
): void => {
  switch (format) {
    case "csv":
    default: {
      const csv = toCsv(rows, columns);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
      res.status(200).send(csv);
      return;
    }
  }
};
