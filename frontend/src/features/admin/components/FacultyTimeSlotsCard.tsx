import { AddTimeSlotModal } from "./AddTimeSlotModal";

export default function FacultyTimeSlotsCard({ facultyId, slots, onUpdated }) {
  return (
    <section>
      <div className="flex justify-between">
        <h3>Time Slots</h3>
        <AddTimeSlotModal facultyId={facultyId} onSuccess={onUpdated} />
      </div>

      {slots.map((s) => (
        <div key={s.id} className="flex justify-between">
          <span>{s.time}</span>
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
