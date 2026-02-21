import { useEffect, useState } from "react";
import { getFacultyById } from "../../../api/faculty.api";

function FacultyDetailsModal({ open, facultyId, onClose }) {
  const [faculty, setFaculty] = useState<FacultyFull | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getFacultyById(facultyId)
      .then(setFaculty)
      .finally(() => setLoading(false));
  }, [open, facultyId]);

  if (!open || !faculty) return null;

  return (
    <Modal onClose={onClose}>
      <FacultyBasicInfoCard faculty={faculty} onUpdated={setFaculty} />

      <FacultyTimeSlotsCard
        facultyId={faculty.id}
        slots={faculty.slots}
        onUpdated={setFaculty}
      />

      <FacultyChapterSlotsCard
        facultyId={faculty.id}
        chapterSlots={faculty.chapterSlots}
        onUpdated={setFaculty}
      />
    </Modal>
  );
}
