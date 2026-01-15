import type { GetChaptersForUserQueryDto } from "../../dtos/get.chapters.user.dto.js";

export interface IGetChaptersForUserUseCase {
  execute(
    dto: GetChaptersForUserQueryDto
  ): Promise<{ id: string; name: string; price: number; icon: string }[]>;
}
