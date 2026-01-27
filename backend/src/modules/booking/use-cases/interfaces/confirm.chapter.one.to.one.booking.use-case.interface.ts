import type { ConfirmChapterOneToOneBookingDto } from "../../dto/confirm.chapter.one.to.one.dto.js";

export interface IConfirmChapterOneToOneBookingUseCase {
  execute(dto: ConfirmChapterOneToOneBookingDto): Promise<void>;
}