import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  facultyId: string;
  syllabuses: any[];
  classes: any[];
  onSuccess: () => void;
};

export function AddChapterSlotModal({
  facultyId,
  syllabuses,
  classes,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("");

  useEffect(() => {
    if (!syllabusId || !classId) return;

    fetch(`/chapters/list?syllabusId=${syllabusId}&classId=${classId}`)
      .then((r) => r.json())
      .then((d) => setChapters(d.data));
  }, [syllabusId, classId]);

  const add = async () => {
    if (!chapterId) return toast.error("Select chapter");

    await fetch(`/faculties/${facultyId}/chapter-slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter: chapterId }),
    });

    toast.success("Chapter added");
    setOpen(false);
    onSuccess();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline">
        ➕ Add
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-3 w-96">
            <h4 className="font-medium">Add Chapter</h4>

            <select onChange={(e) => setSyllabusId(e.target.value)}>
              <option value="">Select syllabus</option>
              {syllabuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              disabled={!syllabusId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              disabled={!chapters.length}
              onChange={(e) => setChapterId(e.target.value)}
            >
              <option value="">Select chapter</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={add} className="btn-primary">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
