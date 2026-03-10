import { useState } from "react";
import toast from "react-hot-toast";
import { handleApiError } from "../../../shared/utils/handle.api.error";

type Props = {
  facultyId: string;
  onSuccess: () => void;
};

export function AddTimeSlotModal({ facultyId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  const save = async () => {
    if (!time) {
      toast.error("Select time");
      return;
    }

    try {
      await fetch(`/faculties/${facultyId}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time }),
      });

      toast.success("Slot added");
      setOpen(false);
      onSuccess();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline">
        ➕ Add
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded space-y-4">
            <h4 className="font-medium">Add Time Slot</h4>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={save} className="btn-primary">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
