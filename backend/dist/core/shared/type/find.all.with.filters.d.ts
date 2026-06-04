export type AllFiltersBase = {
    sort: Record<string, any>;
    limit: number;
    search?: string;
    page: number;
};
export type AcademicListFiltersBase = AllFiltersBase & {
    classId: string | undefined;
    syllabusId: string | undefined;
    subjectId: string | undefined;
    isDeleted: boolean;
};
//# sourceMappingURL=find.all.with.filters.d.ts.map