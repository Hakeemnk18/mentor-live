// get.booking.status.distribution.use-case.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
let GetBookingStatusDistributionUseCase = class GetBookingStatusDistributionUseCase {
    _bookingRepository;
    constructor(_bookingRepository) {
        this._bookingRepository = _bookingRepository;
    }
    async execute() {
        const rawCounts = await this._bookingRepository.getBookingStatusCounts();
        const totalBookings = rawCounts.reduce((acc, curr) => acc + curr.count, 0);
        const statusOrder = [
            "interested",
            "confirmed",
            "cancelled",
            "expired",
        ];
        const statuses = rawCounts
            .map((item) => ({
            status: item._id,
            count: item.count,
            percentage: totalBookings > 0
                ? Math.round((item.count / totalBookings) * 100)
                : 0,
        }))
            .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
        return { totalBookings, statuses };
    }
};
GetBookingStatusDistributionUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __metadata("design:paramtypes", [Object])
], GetBookingStatusDistributionUseCase);
export { GetBookingStatusDistributionUseCase };
//# sourceMappingURL=get.booking.status.use-case.js.map