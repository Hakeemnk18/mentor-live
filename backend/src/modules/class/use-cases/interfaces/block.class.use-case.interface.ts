export interface IBlockClassUseCase {
  execute(id: string): Promise<void>;
}
