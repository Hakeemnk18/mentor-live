export interface IBlockFacultyUseCase {
  execute(facultyId: string): Promise<void>;
}