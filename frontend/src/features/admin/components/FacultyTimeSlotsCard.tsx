import { AddTimeSlotModal } from "./AddTimeSlotModal";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import type { TimeSlot } from "../../../shared/types/faculty.types";

type Props = {
  facultyId: string;
  slots: TimeSlot[];
  onUpdated: () => void;
};

export default function FacultyTimeSlotsCard({ facultyId, slots, onUpdated }: Props) {
  return (
    <section>
      <div className="flex justify-between">
        <h3>Time Slots</h3>
        <AddTimeSlotModal facultyId={facultyId} onSuccess={onUpdated} />
      </div>

      {slots.map((s) => (
        <div key={s.id} className="flex justify-between">
          <span>{formatTimeAMPM(s.time)}</span>
          <button onClick={() => 
        //   deleteSlot(facultyId, s.id)
        console.log("delete slot",facultyId,s.id)
        
        }
            >
            ❌
          </button>
        </div>
      ))}
    </section>
  );
}
