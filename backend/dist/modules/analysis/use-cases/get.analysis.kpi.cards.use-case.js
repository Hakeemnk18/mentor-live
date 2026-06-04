// get.booking.kpi.cards.use-case.ts
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
let GetAnalysisKpiCardsUseCase = class GetAnalysisKpiCardsUseCase {
    _bookingRepository;
    _facultyRepository;
    _studentRepository;
    constructor(_bookingRepository, _facultyRepository, _studentRepository) {
        this._bookingRepository = _bookingRepository;
        this._facultyRepository = _facultyRepository;
        this._studentRepository = _studentRepository;
    }
    calculateTrend(current, previous) {
        if (previous === 0) {
            return {
                percentageChange: current > 0 ? 100 : 0,
                direction: "up",
                comparedTo: "last_month",
            };
        }
        const change = ((current - previous) / previous) * 100;
        return {
            percentageChange: Math.abs(Math.round(change)),
            direction: change >= 0 ? "up" : "down",
            comparedTo: "last_month",
        };
    }
    async execute() {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(now.getDate() - 60);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        // ── Fetch all in parallel ──────────────────────────────────────────────────
        const [
        // Current period (last 30d)
        currentBookingStats, currentFacultyCount, currentStudentCount, 
        // Previous period (day 31–60) for trend
        prevBookingStats, prevFacultyCount, prevStudentCount, 
        // Sparklines (last 7d)
        dailyBookingStats, dailyFacultyStats, dailyStudentStats, 
        // Snapshot
        uncontactedCount,] = await Promise.all([
            this._bookingRepository.getAggregateBookingKpiStats(thirtyDaysAgo, now),
            this._facultyRepository.getFacultyCountInRange(thirtyDaysAgo, now),
            this._studentRepository.getStudentCountInRange(thirtyDaysAgo, now),
            this._bookingRepository.getAggregateBookingKpiStats(sixtyDaysAgo, thirtyDaysAgo),
            this._facultyRepository.getFacultyCountInRange(sixtyDaysAgo, thirtyDaysAgo),
            this._studentRepository.getStudentCountInRange(sixtyDaysAgo, thirtyDaysAgo),
            this._bookingRepository.getDailyBookingKpiStats(sevenDaysAgo, now),
            this._facultyRepository.getDailyFacultyKpiStats(sevenDaysAgo, now),
            this._studentRepository.getDailyStudentKpiStats(sevenDaysAgo, now),
            this._bookingRepository.getUncontactedBookingsCount(),
        ]);
        // ── Sparkline padding (exactly 7 days, missing days → 0) ──────────────────
        const sparklineDates = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(now.getDate() - (6 - i));
            return d.toISOString().split("T")[0];
        });
        const bookingsSparkline = sparklineDates.map((date) => dailyBookingStats.find((d) => d._id === date)?.bookings ?? 0);
        const facultySparkline = sparklineDates.map((date) => dailyFacultyStats.find((d) => d._id === date)?.count ?? 0);
        const studentSparkline = sparklineDates.map((date) => dailyStudentStats.find((d) => d._id === date)?.count ?? 0);
        // ── Build cards ───────────────────────────────────────────────────────────
        return [
            {
                key: "total_bookings",
                label: "Total Bookings",
                value: currentBookingStats.totalBookings,
                formattedValue: currentBookingStats.totalBookings.toString(),
                trend: this.calculateTrend(currentBookingStats.totalBookings, prevBookingStats.totalBookings),
                sparkline: bookingsSparkline,
            },
            {
                key: "total_faculties",
                label: "New Faculties",
                value: currentFacultyCount,
                formattedValue: currentFacultyCount.toString(),
                trend: this.calculateTrend(currentFacultyCount, prevFacultyCount),
                sparkline: facultySparkline,
            },
            {
                key: "total_students",
                label: "New Students",
                value: currentStudentCount,
                formattedValue: currentStudentCount.toString(),
                trend: this.calculateTrend(currentStudentCount, prevStudentCount),
                sparkline: studentSparkline,
            },
            {
                key: "uncontacted_bookings",
                label: "Uncontacted Bookings",
                value: uncontactedCount,
                formattedValue: uncontactedCount.toString(),
                // No trend — snapshot value, like your pendingOrdersCount
                action: {
                    label: "View Bookings",
                    href: "/admin/bookings?isContacted=false",
                },
            },
        ];
    }
};
GetAnalysisKpiCardsUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __param(2, inject("IStudentRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetAnalysisKpiCardsUseCase);
export { GetAnalysisKpiCardsUseCase };
//# sourceMappingURL=get.analysis.kpi.cards.use-case.js.map