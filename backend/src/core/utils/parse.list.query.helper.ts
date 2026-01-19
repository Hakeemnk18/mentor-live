import type { Request } from "express";

export interface IListQueryParseResult {
  page: number;
  limit: number;
  search: string;
  sortValue: string;
  classId: string;
  subjectId: string;
  syllabusId: string;
}

export function parseListQuery(req: Request): IListQueryParseResult {
  return {
    page: Number(req.query.page) || 1,
    limit : Number(req.query.limit) || 10,
    search: (req.query.search as string) ?? "",
    sortValue: (req.query.sort as string) ?? "createdAt",
    classId: req.query.classId as string,
    syllabusId:req.query.syllabusId as string,
    subjectId: req.query.subjectId as string
  };
}
