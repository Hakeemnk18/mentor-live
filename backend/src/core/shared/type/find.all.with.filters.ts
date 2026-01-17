export type AcademicListFiltersBase = {
  classId: string | undefined;
  syllabusId: string | undefined;
  subjectId:string | undefined;
  sort: Record<string, 1 | -1>;
  limit: number;
  search?: string;
  page: number;
};