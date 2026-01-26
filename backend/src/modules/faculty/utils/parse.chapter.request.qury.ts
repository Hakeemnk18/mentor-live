import type { Request } from "express";

export interface IChapterQueryParseResult {
  page: number;
  limit: number;
  search: string;
  sortValue: string;
  chapterId: string
}

export function parseChapterQuery(req: Request): IChapterQueryParseResult {
  return {
    page: Number(req.query.page) || 1,
    limit : Number(req.query.limit) || 10,
    search: (req.query.search as string) ?? "",
    sortValue: (req.query.sort as string) ?? "createdAt",
    chapterId: req.query.chapterId as string,
  };
}
