export interface IBlockChapterUseCase {
  execute(id: string): Promise<void>;
}
