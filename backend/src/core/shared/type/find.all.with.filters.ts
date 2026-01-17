export type findAllWithFilters = {
  classId: string;
  syllabusId: string;
  subjectId: string | undefined;
  sort: Record<string, 1 | -1>;
  limit: number;
  search?: string;
  page: number;
};