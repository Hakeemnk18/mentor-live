export type GetAllSubjectForUserFilters = {
  syllabusId?: string | undefined;
  classId?: string | undefined;
};

export interface IGetAllSubjectForUserUseCase {
  execute(filters?: GetAllSubjectForUserFilters): Promise<{ id: string; name: string }[]>;
}
