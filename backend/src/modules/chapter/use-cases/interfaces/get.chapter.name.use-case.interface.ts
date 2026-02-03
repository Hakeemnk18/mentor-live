export interface IGetChapterNameUseCase {
  execute(): Promise<{ id: string; name: string }[]>;
}