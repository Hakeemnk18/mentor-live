import type { CreateChapterRequestDto } from "../../dtos/create.chapter.dto.js"; 

export interface ICreateChapterUseCase {
  execute(dto: CreateChapterRequestDto): Promise<void>;
}
