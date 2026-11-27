export interface IUnblockSubjectUseCase {
  execute(id: string): Promise<void>;
}
