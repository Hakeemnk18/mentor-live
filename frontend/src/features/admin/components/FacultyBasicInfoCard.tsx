import { useState } from "react";
import EditFacultyBasicModal from "./EditFacultyBasicModal";

export default function FacultyBasicInfoCard({ faculty, onUpdated }) {
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
          initialData={faculty}
          onClose={() => setEditOpen(false)}
          onSuccess={onUpdated}
        />
      )}
    </section>
  );
}
