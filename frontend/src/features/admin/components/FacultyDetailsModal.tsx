import { useEffect, useState } from "react";
import { getFacultyById } from "../../../api/faculty.api";
import FacultyBasicInfoCard from "./FacultyBasicInfoCard";
import type { FacultyData } from "../../../shared/types/faculty.types";

type Props = {
  open: boolean;
  facultyId: string;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
  onClose: () => void;
};

export default function FacultyDetailsModal({ open, facultyId, syllabuses, classes, onClose }: Props) {
  const [faculty, setFaculty] = useState<FacultyData | null>(null);

  useEffect(() => {
    if (!open) return;
    getFacultyById(facultyId).then(setFaculty);
  }, [open, facultyId]);

  if (!open || !faculty) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <FacultyBasicInfoCard
          faculty={faculty}
          syllabuses={syllabuses}
          classes={classes}
          onUpdated={() => {
            getFacultyById(facultyId).then(setFaculty);
          }}
        />
      </div>
    </div>
  );
}
