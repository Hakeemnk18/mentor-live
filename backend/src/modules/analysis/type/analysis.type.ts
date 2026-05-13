import type { BookingStatus } from "../../booking/type/booking.type.js";

export type RevenueRange = "Year" | "Month" | "Week" | "Daily";

export type RevenueChartData = {
  range: RevenueRange;
  currency: "INR" | "USD";
  series: {
    label: string;
    data: number[];
  };
  categories: string[];
};

export type DashboardKpiCardType = {
  key: "orders" | "revenue" | "users" | "pending_orders";
  label: string;
  value: number;
  formattedValue: string;
  trend?: {
    percentageChange: number;
    direction: "up" | "down";
    comparedTo: "last_month" | "last_week";
  };
  sparkline?: number[];
  action?: {
    label: string;
    href: string;
  };
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
    type?: "revenue" | "orders";
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

export type OrderStatusDistribution = {
  totalOrders: number;
  statuses: {
    status: BookingStatus;
    count: number;
    percentage: number;
  }[];
};
