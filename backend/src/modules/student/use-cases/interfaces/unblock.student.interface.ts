export interface IUnblockStudentUseCase {
  execute(studentId: string): Promise<void>;
}