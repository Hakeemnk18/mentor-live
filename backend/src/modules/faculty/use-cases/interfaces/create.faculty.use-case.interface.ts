import type { CreateFacultyRequestDto } from "../../dtos/create.faculty.dto.js"; 

export interface ICreateFacultyUseCase {
  execute(dto: CreateFacultyRequestDto): Promise<void>;
}