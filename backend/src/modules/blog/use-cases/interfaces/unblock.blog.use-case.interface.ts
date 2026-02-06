export interface IUnblockBlogUseCase {
  execute(id: string): Promise<void>;
}