export interface IGetClassesForUserUseCase {
  execute(): Promise<{ id: string; name: string }[]>;
}