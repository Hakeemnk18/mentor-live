export interface IBlockStudentUseCase {
  execute(studentId: string): Promise<void>;
}