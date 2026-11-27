export interface IBlockSubjectUseCase {
  execute(id: string): Promise<void>;
}
