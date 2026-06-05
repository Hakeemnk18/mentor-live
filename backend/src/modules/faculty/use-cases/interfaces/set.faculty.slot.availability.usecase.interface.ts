export interface ISetFacultySlotAvailabilityDto {
  /** "slot" for time-based slots, "chapter" for chapter slots */
  mode: "slot" | "chapter";
  facultyId: string;
  /** Required when mode = "slot" */
  slotId?: string;
  /** Required when mode = "chapter" */
  chapterId?: string;
  isAvailable: boolean;
}

export interface ISetFacultySlotAvailabilityUseCase {
  execute(dto: ISetFacultySlotAvailabilityDto): Promise<void>;
}
