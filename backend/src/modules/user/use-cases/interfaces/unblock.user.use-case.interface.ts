export interface IUnblockUserUseCase {
  execute(id: string): Promise<void>;
}
