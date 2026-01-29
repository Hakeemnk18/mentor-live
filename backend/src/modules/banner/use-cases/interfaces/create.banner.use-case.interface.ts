import type { CreateBannerRequestDto } from "../../dto/create.banner.dto.js";

export interface ICreateBannerUseCase {
  execute(dto: CreateBannerRequestDto): Promise<void>;
}