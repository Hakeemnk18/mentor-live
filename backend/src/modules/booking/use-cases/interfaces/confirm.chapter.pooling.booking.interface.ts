import type { ConfirmChapterPoolingBookingDto } from "../../dto/confirm.chapter.pooling.dto.js";

export interface IConfirmChapterPoolingBookingUseCase {
  execute(dto: ConfirmChapterPoolingBookingDto): Promise<void>;
}