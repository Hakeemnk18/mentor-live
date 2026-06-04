import type { CreateBookingRequestDto } from "../../dto/create.booking.dto.js";
export interface ICreateBookingUseCase {
    execute(dto: CreateBookingRequestDto): Promise<void>;
}
//# sourceMappingURL=create.booking.use-case.interface.d.ts.map