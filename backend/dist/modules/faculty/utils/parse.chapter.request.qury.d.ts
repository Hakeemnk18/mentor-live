import type { Request } from "express";
export interface IChapterQueryParseResult {
    page: number;
    limit: number;
    search: string;
    sortValue: string;
    chapterId: string;
}
export declare function parseChapterQuery(req: Request): IChapterQueryParseResult;
//# sourceMappingURL=parse.chapter.request.qury.d.ts.map