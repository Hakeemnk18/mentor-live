import { useState } from "react";
import EditFacultyBasicModal from "./EditFacultyBasicModal";
import type { FacultyData } from "../../../shared/types/faculty.types";

type Props = {
  faculty: FacultyData;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
  onUpdated: () => void;
};

export default function FacultyBasicInfoCard({ faculty, syllabuses, classes, onUpdated }: Props) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <section>
      <div className="flex justify-between">
        <h3>Basic Details</h3>
        <button onClick={() => setEditOpen(true)}>✏️ Edit</button>
      </div>

      <p><b>Name:</b> {faculty.name}</p>
      <p><b>Qualifications:</b> {faculty.qualifications.join(", ")}</p>
      <p><b>Description:</b> {faculty.description}</p>

      {editOpen && (
        <EditFacultyBasicModal
          open={editOpen}
          facultyId={faculty.id}
          initialData={faculty}
          syllabuses={syllabuses}
          classes={classes}
          onClose={() => setEditOpen(false)}
          onSuccess={onUpdated}
        />
      )}
    </section>
  );
}
