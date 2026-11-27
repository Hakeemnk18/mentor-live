export interface IBlockSyllabusUseCase {
  execute(id: string): Promise<void>;
}
