// get.booking.motivation.use-case.ts
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
let GetAllAnalysisMotivationUseCase = class GetAllAnalysisMotivationUseCase {
    _bookingRepository;
    constructor(_bookingRepository) {
        this._bookingRepository = _bookingRepository;
    }
    formatNumber(count) {
        return new Intl.NumberFormat("en-IN").format(count);
    }
    calculatePercentage(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    }
    calculateNextTarget(current) {
        if (current === 0)
            return { value: 10, progress: 0 };
        const magnitude = Math.pow(10, Math.floor(Math.log10(current)));
        let target = (Math.floor(current / magnitude) + 1) * magnitude;
        // Keep small booking counts from jumping to unreachable targets
        if (target <= 10)
            target = 10;
        else if (target <= 50)
            target = 50;
        return {
            value: target,
            progress: Math.round((current / target) * 100),
        };
    }
    async execute() {
        const now = new Date();
        const last24hStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const prev24hStart = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        const last7dStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const prev7dStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        // All 6 aggregates in one round-trip
        const [last24h, prev24h, last7d, prev7d, uncontacted, confirmed7d] = await Promise.all([
            this._bookingRepository.getAggregateBookingKpiStats(last24hStart, now),
            this._bookingRepository.getAggregateBookingKpiStats(prev24hStart, last24hStart),
            this._bookingRepository.getAggregateBookingKpiStats(last7dStart, now),
            this._bookingRepository.getAggregateBookingKpiStats(prev7dStart, last7dStart),
            this._bookingRepository.getUncontactedBookingsCount(),
            this._bookingRepository.getConfirmedBookingsCount(last7dStart, now),
        ]);
        // ── CONDITION 1: Bookings are up in the last 24 h ─────────────────────────
        if (last24h.totalBookings > prev24h.totalBookings) {
            return {
                title: "Students are showing interest! 🚀",
                subtitle: "More bookings came in today than the previous 24 hours.",
                metric: {
                    value: last24h.totalBookings,
                    formatted: this.formatNumber(last24h.totalBookings),
                    type: "bookings",
                },
                comparison: {
                    percentageChange: this.calculatePercentage(last24h.totalBookings, prev24h.totalBookings),
                    comparedTo: "last_24_hours",
                },
                cta: { label: "View Bookings", path: "/admin/bookings" },
            };
        }
        // ── CONDITION 2: Bookings are up over the last 7 d ───────────────────────
        if (last7d.totalBookings > prev7d.totalBookings) {
            return {
                title: "Great week for bookings 📈",
                subtitle: "Booking volume is growing compared to the previous week.",
                metric: {
                    value: last7d.totalBookings,
                    formatted: this.formatNumber(last7d.totalBookings),
                    type: "bookings",
                },
                comparison: {
                    percentageChange: this.calculatePercentage(last7d.totalBookings, prev7d.totalBookings),
                    comparedTo: "last_week",
                },
                cta: { label: "View Bookings", path: "/admin/bookings" },
            };
        }
        // ── CONDITION 3: Good confirmed-to-total ratio this week ─────────────────
        // Surfaces when raw numbers are flat but conversion is healthy
        if (last7d.totalBookings > 0) {
            const confirmRate = Math.round((confirmed7d / last7d.totalBookings) * 100);
            if (confirmRate >= 50) {
                return {
                    title: "Strong conversion this week 🎯",
                    subtitle: `${confirmRate}% of this week's bookings have been confirmed.`,
                    metric: {
                        value: confirmed7d,
                        formatted: this.formatNumber(confirmed7d),
                        type: "confirmed",
                    },
                    comparison: {
                        percentageChange: confirmRate,
                        comparedTo: "last_week",
                    },
                    cta: { label: "View Bookings", path: "/admin/bookings" },
                };
            }
        }
        // ── CONDITION 4: Uncontacted bookings need attention ─────────────────────
        // Flip the framing — treat follow-ups as opportunity, not failure
        if (uncontacted > 0) {
            return {
                title: "Follow-ups waiting 📋",
                subtitle: `${this.formatNumber(uncontacted)} ${uncontacted === 1 ? "student hasn't" : "students haven't"} been contacted yet. A quick call can convert them.`,
                metric: {
                    value: uncontacted,
                    formatted: this.formatNumber(uncontacted),
                    type: "uncontacted",
                },
                cta: {
                    label: "View Uncontacted",
                    path: "/admin/bookings?isContacted=false",
                },
            };
        }
        // ── CONDITION 5: Fallback — set a target to chase ────────────────────────
        const targetData = this.calculateNextTarget(last7d.totalBookings);
        return {
            title: "Keep the momentum going 💪",
            subtitle: "Every student booking is a step forward. Stay consistent.",
            metric: {
                value: last7d.totalBookings,
                formatted: this.formatNumber(last7d.totalBookings),
                type: "bookings",
            },
            target: {
                value: targetData.value,
                progressPercentage: targetData.progress,
            },
            cta: { label: "View Bookings", path: "/admin/bookings" },
        };
    }
};
GetAllAnalysisMotivationUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllAnalysisMotivationUseCase);
export { GetAllAnalysisMotivationUseCase };
//# sourceMappingURL=get.motivation.use-case.js.map