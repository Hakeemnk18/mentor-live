import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
export class Faculty {
    id;
    name;
    qualifications;
    description;
    demoClass;
    image;
    subjectOffering;
    slots;
    chapterSlots;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.qualifications = props.qualifications;
        this.description = props.description;
        this.demoClass = props.demoClass;
        this.image = props.image;
        this.subjectOffering = props.subjectOffering;
        this.slots = props.slots;
        this.chapterSlots = props.chapterSlots;
        this.isDeleted = props.isDeleted;
    }
    /* ---------- Status ---------- */
    isActive() {
        return !this.isDeleted;
    }
    markAsDeleted() {
        return {
            ...this,
            isDeleted: true,
        };
    }
    markAsUnblocked() {
        return {
            ...this,
            isDeleted: false,
        };
    }
    /* ---------- Slots ---------- */
    getAvailableSlots() {
        return this.slots.filter((slot) => slot.isAvailable);
    }
    getAvailableChapterSlots() {
        return this.chapterSlots.filter((slot) => slot.isAvailable);
    }
    isSlotFull(slot) {
        return slot.pool.length >= slot.poolLimit;
    }
    updateProfile(props) {
        return {
            ...this,
            name: props.name,
            qualifications: props.qualifications,
            description: props.description,
            demoClass: props.demoClass,
            image: props.image,
            subjectOffering: props.subjectOffering,
        };
    }
    /* ---------- add slot ---------- */
    addSlots(newSlots) {
        const existingTimes = new Set(this.slots.map((s) => s.time.getTime()));
        const slotsToAdd = newSlots.map((slot) => {
            const t = slot.time.getTime();
            if (existingTimes.has(t)) {
                throw new CustomError(ResponseMessages.SLOT_ALREADY_EXIST, HttpStatusCode.BAD_REQUEST);
            }
            existingTimes.add(t);
            return {
                time: slot.time,
                isAvailable: true,
                pool: [],
                poolLimit: 5,
            };
        });
        return {
            ...this,
            slots: [...this.slots, ...slotsToAdd],
        };
    }
    /* ---------- add chapter slot ---------- */
    addChapterSlots(newChapterSlots) {
        const existingChapters = new Set(this.chapterSlots.map((s) => s.chapterId));
        const slotsToAdd = newChapterSlots.map((slot) => {
            if (existingChapters.has(slot.chapter)) {
                throw new CustomError(ResponseMessages.CHAPTER_SLOT_ALREADY_EXIST, HttpStatusCode.BAD_REQUEST);
            }
            existingChapters.add(slot.chapter);
            return {
                chapterId: slot.chapter,
                isAvailable: true,
                pool: [],
                poolLimit: 5,
            };
        });
        return {
            ...this,
            chapterSlots: [...this.chapterSlots, ...slotsToAdd],
        };
    }
}
//# sourceMappingURL=faculty.entity.js.map