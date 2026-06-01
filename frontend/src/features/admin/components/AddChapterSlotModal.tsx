import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "../../../shared/components/SearchableSelect";

type NamedItem = { _id: string; name: string };

type Props = {
  facultyId: string;
  syllabuses: NamedItem[];
  classes: NamedItem[];
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
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
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

            <SearchableSelect
              value={syllabusId}
              onChange={setSyllabusId}
              options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
              placeholder="Select syllabus"
            />

            <SearchableSelect
              value={classId}
              onChange={setClassId}
              options={classes.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Select class"
              disabled={!syllabusId}
            />

            <SearchableSelect
              value={chapterId}
              onChange={setChapterId}
              options={chapters.map((c) => ({ value: c.id, label: c.name }))}
              placeholder={chapters.length === 0 ? "Select class first" : "Select chapter"}
              disabled={!syllabusId || !classId}
            />

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
