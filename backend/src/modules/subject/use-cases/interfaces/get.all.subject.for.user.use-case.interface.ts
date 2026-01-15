export interface IGetAllSubjectForUserUseCase {
  execute(): Promise<{ id: string; name: string }[]>;
}