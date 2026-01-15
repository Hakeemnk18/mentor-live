export interface IUnblockChapterUseCase {
  execute(id: string): Promise<void>;
}
