import type { BookingStatus } from "../../booking/type/booking.type.js";
export type BookingChartRange = "Daily" | "Week" | "Month" | "Year";
export type BookingChartSeries = {
    label: "One-to-One" | "Pooling";
    data: number[];
};
export type AnalysisChartData = {
    range: BookingChartRange;
    categories: string[];
    series: BookingChartSeries[];
};
export type BookingRange = "7d" | "30d" | "6m" | "1y";
export type TopFacultyBookingItem = {
    facultyId: string;
    name: string;
    totalBookings: number;
    confirmedBookings: number;
};
export type TopFacultyBookingResponse = {
    range: BookingRange;
    faculties: TopFacultyBookingItem[];
};
export type LowFacultyBookingItem = {
    facultyId: string;
    name: string;
    totalBookings: number;
    confirmedBookings: number;
};
export type LowFacultyBookingResponse = {
    range: BookingRange;
    faculties: LowFacultyBookingItem[];
};
export type ZeroBookingFacultyItem = {
    facultyId: string;
    name: string;
};
export type ZeroBookingChapterItem = {
    chapterId: string;
    name: string;
    iconUrl: string;
};
export type ZeroBookingResponse = {
    range: BookingRange;
    faculties: ZeroBookingFacultyItem[];
    chapters: ZeroBookingChapterItem[];
};
export type AnalysisTableResponse = {
    topFacultyBookings: TopFacultyBookingResponse;
    lowFacultyBookings: LowFacultyBookingResponse;
    zeroBookingItems: ZeroBookingResponse;
};
export type DashboardMotivationSummary = {
    title: string;
    subtitle: string;
    metric: {
        value: number;
        formatted: string;
        type?: "bookings" | "student" | "confirmed" | "uncontacted";
    };
    target?: {
        value: number;
        progressPercentage: number;
    };
    comparison?: {
        percentageChange: number;
        comparedTo: "last_24_hours" | "last_week";
    };
    cta?: {
        label: string;
        path: string;
    };
};
export type BookingStatusDistribution = {
    totalBookings: number;
    statuses: {
        status: BookingStatus;
        count: number;
        percentage: number;
    }[];
};
export type BookingKpiCardKey = "total_bookings" | "total_faculties" | "total_students" | "uncontacted_bookings";
export type BookingKpiTrend = {
    percentageChange: number;
    direction: "up" | "down";
    comparedTo: "last_month";
};
export type BookingKpiAction = {
    label: string;
    href: string;
};
export type AnalysisKpiCard = {
    key: BookingKpiCardKey;
    label: string;
    value: number;
    formattedValue: string;
    trend?: BookingKpiTrend;
    sparkline?: number[];
    action?: BookingKpiAction;
};
//# sourceMappingURL=analysis.type.d.ts.map