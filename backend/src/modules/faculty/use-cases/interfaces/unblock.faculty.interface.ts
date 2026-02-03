export interface IUnblockFacultyUseCase {
  execute(facultyId: string): Promise<void>;
}