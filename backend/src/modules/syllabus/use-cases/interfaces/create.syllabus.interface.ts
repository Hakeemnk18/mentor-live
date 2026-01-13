import type { CreateSyllabusRequestDto } from "../../dtos/syllabus.create.dto.js";


export interface ICreateSyllabusUseCase {
  execute(dto: CreateSyllabusRequestDto): Promise<void>;
}