import type { Request } from "express";
export interface IListQueryParseResult {
    page: number;
    limit: number;
    search: string;
    sortValue: string;
    classId: string;
    subjectId: string;
    syllabusId: string;
    isDeleted?: string | boolean;
}
export declare function parseListQuery(req: Request): IListQueryParseResult;
//# sourceMappingURL=parse.list.query.helper.d.ts.map