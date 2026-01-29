import type { CreateBannerRequestDto } from "../../dto/create.banner.dto.js";

export interface IEditBannerUseCase {
  execute(id: string, dto: CreateBannerRequestDto): Promise<void>;
}