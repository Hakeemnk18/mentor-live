// get.booking.kpi.cards.use-case.ts

import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { IStudentRepository } from "../../student/repositories/student.repository.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "./interfaces/get.analysis.kpi.cards.use-case.interface.js";
import type { AnalysisKpiCard } from "../type/analysis.type.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";

@injectable()
export class GetAnalysisKpiCardsUseCase implements IGetAnalysisKpiCardsUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IStudentRepository")
    private readonly _studentRepository: IStudentRepository,
  ) {}

  private calculateTrend(current: number, previous: number) {
    if (previous === 0) {
      return {
        percentageChange: current > 0 ? 100 : 0,
        direction: "up" as const,
        comparedTo: "last_month" as const,
      };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      percentageChange: Math.abs(Math.round(change)),
      direction: change >= 0 ? ("up" as const) : ("down" as const),
      comparedTo: "last_month" as const,
    };
  }

  async execute(): Promise<AnalysisKpiCard[]> {
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
      currentBookingStats,
      currentFacultyCount,
      currentStudentCount,

      // Previous period (day 31–60) for trend
      prevBookingStats,
      prevFacultyCount,
      prevStudentCount,

      // Sparklines (last 7d)
      dailyBookingStats,
      dailyFacultyStats,
      dailyStudentStats,

      // Snapshot
      uncontactedCount,
    ] = await Promise.all([
      this._bookingRepository.getAggregateBookingKpiStats(thirtyDaysAgo, now),
      this._facultyRepository.getFacultyCountInRange(thirtyDaysAgo, now),
      this._studentRepository.getStudentCountInRange(thirtyDaysAgo, now),

      this._bookingRepository.getAggregateBookingKpiStats(
        sixtyDaysAgo,
        thirtyDaysAgo,
      ),
      this._facultyRepository.getFacultyCountInRange(
        sixtyDaysAgo,
        thirtyDaysAgo,
      ),
      this._studentRepository.getStudentCountInRange(
        sixtyDaysAgo,
        thirtyDaysAgo,
      ),

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

    const bookingsSparkline = sparklineDates.map(
      (date) => dailyBookingStats.find((d) => d._id === date)?.bookings ?? 0,
    );
    const facultySparkline = sparklineDates.map(
      (date) => dailyFacultyStats.find((d) => d._id === date)?.count ?? 0,
    );
    const studentSparkline = sparklineDates.map(
      (date) => dailyStudentStats.find((d) => d._id === date)?.count ?? 0,
    );

    // ── Build cards ───────────────────────────────────────────────────────────
    return [
      {
        key: "total_bookings",
        label: "Total Bookings",
        value: currentBookingStats.totalBookings,
        formattedValue: currentBookingStats.totalBookings.toString(),
        trend: this.calculateTrend(
          currentBookingStats.totalBookings,
          prevBookingStats.totalBookings,
        ),
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
}
