import type { ImageValue } from "../../../core/shared/type/image.type.js";
import type { ChapterSlotProps, FacultyProps, SlotProps, SubjectOfferingItem } from "../types/faculty.type.js";
export declare class Faculty {
    readonly id: string | null;
    readonly name: string;
    readonly qualifications: string[];
    readonly description: string;
    readonly demoClass: string;
    readonly image: ImageValue;
    readonly subjectOffering: SubjectOfferingItem[];
    readonly slots: SlotProps[];
    readonly chapterSlots: ChapterSlotProps[];
    readonly isDeleted: boolean;
    constructor(props: FacultyProps);
    isActive(): boolean;
    markAsDeleted(): Faculty;
    markAsUnblocked(): Faculty;
    getAvailableSlots(): SlotProps[];
    getAvailableChapterSlots(): ChapterSlotProps[];
    isSlotFull(slot: SlotProps): boolean;
    updateProfile(props: {
        name: string;
        qualifications: string[];
        description: string;
        demoClass: string;
        image: ImageValue;
        subjectOffering: SubjectOfferingItem[];
    }): Faculty;
    addSlots(newSlots: {
        time: Date;
    }[]): Faculty;
    addChapterSlots(newChapterSlots: {
        chapter: string;
    }[]): Faculty;
}
//# sourceMappingURL=faculty.entity.d.ts.map