export interface IUnblockClassUseCase {
  execute(id: string): Promise<void>;
}
