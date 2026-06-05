import type { ClientSession } from "mongoose";

export interface FacultySlotProps {
  id: string | null;
  facultyId: string;
  variantId: string;
  time: Date;
  isAvailable: boolean;
  pool: string[];
  poolLimit: number;
}

export interface FacultySlotCreationProps {
  facultyId: string;
  variantId: string;
  time: Date;
  poolLimit?: number;
}

/** Shape returned to the admin panel for one slot */
export interface FacultySlotAdminView {
  id: string;
  variantId: string;
  time: string;          // HH:mm
  isAvailable: boolean;
  pool: { id: string }[];
  poolLimit: number;
}

/** Minimal shape for student-facing slot picker */
export interface AvailableSlotView {
  id: string;
  time: Date;
  variantId: string;
}
