export interface IBlockBlogUseCase {
  execute(id: string): Promise<void>;
}