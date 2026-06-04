export class Booking {
    id;
    userId;
    facultyId;
    type;
    mode;
    slotId;
    chapterId;
    class;
    syllabus;
    isContacted;
    status;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.userId = props.userId;
        this.facultyId = props.facultyId;
        this.type = props.type;
        this.mode = props.mode;
        this.class = props.class;
        this.syllabus = props.syllabus;
        if (props.slotId !== undefined) {
            this.slotId = props.slotId;
        }
        if (props.chapterId !== undefined) {
            this.chapterId = props.chapterId;
        }
        this.isContacted = props.isContacted ?? false;
        this.status = props.status ?? "interested";
        this.isDeleted = props.isDeleted ?? false;
    }
    delete() {
        if (this.isDeleted) {
            throw new Error("Booking already deleted");
        }
        return new Booking({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Booking is not deleted");
        }
        return new Booking({
            ...this,
            isDeleted: false,
        });
    }
    confirm() {
        if (this.status !== "interested") {
            throw new Error("Invalid booking state transition");
        }
        return new Booking({
            ...this,
            isContacted: true,
            status: "confirmed"
        });
    }
    confirmWithSlots(slotId) {
        if (this.status !== "interested") {
            throw new Error("Invalid booking state transition");
        }
        return new Booking({
            ...this,
            slotId,
            status: "confirmed",
            isContacted: true,
        });
    }
}
//# sourceMappingURL=booking.entity.js.map