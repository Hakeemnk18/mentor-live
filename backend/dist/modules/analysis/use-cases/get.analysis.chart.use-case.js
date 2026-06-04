// get.booking.chart.use-case.ts
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
let GetAnalysisChartUseCase = class GetAnalysisChartUseCase {
    _bookingRepository;
    constructor(_bookingRepository) {
        this._bookingRepository = _bookingRepository;
    }
    async execute(dto) {
        const { range } = dto;
        const endDate = new Date();
        let startDate = new Date();
        let categories = [];
        // series[0] = oneToOne, series[1] = pooling
        let oneToOneData = [];
        let poolingData = [];
        // ── 1. Timeframes & bucket scaffolding ────────────────────────────────────
        switch (range) {
            case "Daily":
                startDate.setHours(endDate.getHours() - 24);
                categories = [
                    "12 AM",
                    "3 AM",
                    "6 AM",
                    "9 AM",
                    "12 PM",
                    "3 PM",
                    "6 PM",
                    "9 PM",
                ];
                oneToOneData = new Array(8).fill(0);
                poolingData = new Array(8).fill(0);
                break;
            case "Week":
                startDate.setDate(endDate.getDate() - 7);
                categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                oneToOneData = new Array(7).fill(0);
                poolingData = new Array(7).fill(0);
                break;
            case "Month":
                startDate.setDate(endDate.getDate() - 30);
                categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
                oneToOneData = new Array(4).fill(0);
                poolingData = new Array(4).fill(0);
                break;
            case "Year":
                startDate.setFullYear(endDate.getFullYear() - 1);
                categories = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];
                oneToOneData = new Array(12).fill(0);
                poolingData = new Array(12).fill(0);
                break;
            default:
                throw new Error("Invalid range provided");
        }
        // ── 2. Fetch from DB ──────────────────────────────────────────────────────
        const bookings = await this._bookingRepository.getBookingsForChart(startDate, endDate);
        // ── 3. Bucket ─────────────────────────────────────────────────────────────
        bookings.forEach((booking) => {
            const createdAt = new Date(booking.createdAt);
            let bucketIndex = 0;
            switch (range) {
                case "Daily":
                    bucketIndex = Math.floor(createdAt.getHours() / 3);
                    break;
                case "Week":
                    // getDay(): 0 = Sun → map to index 6, 1 = Mon → 0 … 6 = Sat → 5
                    bucketIndex = createdAt.getDay() === 0 ? 6 : createdAt.getDay() - 1;
                    break;
                case "Month":
                    bucketIndex = Math.min(Math.floor((createdAt.getDate() - 1) / 7), 3);
                    break;
                case "Year":
                    bucketIndex = createdAt.getMonth(); // 0 = Jan … 11 = Dec
                    break;
            }
            if (bucketIndex >= 0 && bucketIndex < categories.length) {
                if (booking.type === "oneToOne") {
                    oneToOneData[bucketIndex]++;
                }
                else if (booking.type === "pooling") {
                    poolingData[bucketIndex]++;
                }
            }
        });
        // ── 4. Return ─────────────────────────────────────────────────────────────
        return {
            range,
            categories,
            series: [
                { label: "One-to-One", data: oneToOneData },
                { label: "Pooling", data: poolingData },
            ],
        };
    }
};
GetAnalysisChartUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __metadata("design:paramtypes", [Object])
], GetAnalysisChartUseCase);
export { GetAnalysisChartUseCase };
//# sourceMappingURL=get.analysis.chart.use-case.js.map