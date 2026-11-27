export interface IUnblockSyllabusUseCase {
  execute(id: string): Promise<void>;
}
