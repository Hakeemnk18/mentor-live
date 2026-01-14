
export interface IEditSubjectUseCase {
  execute(id: string, name: string): Promise<void>;
}