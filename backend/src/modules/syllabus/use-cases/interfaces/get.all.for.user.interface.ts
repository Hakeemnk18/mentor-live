export interface IGetSyllabusesForUserUseCase {
  execute(): Promise<{ id: string; name: string }[]>;
}