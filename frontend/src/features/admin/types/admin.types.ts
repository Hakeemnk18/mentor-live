// 1. Define the types based on your backend JSON structure
export interface FacultyItem {
  facultyId: string;
  name: string;
  totalBookings?: number;
  confirmedBookings?: number;
}

export interface ChapterItem {
  chapterId: string;
  name: string;
  iconUrl: string;
}

export interface AnalysisTableData {
  topFacultyBookings: {
    range: string;
    faculties: FacultyItem[];
  };
  lowFacultyBookings: {
    range: string;
    faculties: FacultyItem[];
  };
  zeroBookingItems: {
    range: string;
    faculties: FacultyItem[];
    chapters: ChapterItem[];
  };
}

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