export interface SyllabusProps {
    id: string | null;
    name: string;
    isDeleted?: boolean;
}
export declare class Syllabus {
    readonly id: string | null;
    readonly name: string;
    readonly isDeleted: boolean;
    constructor(props: SyllabusProps);
    delete(): Syllabus;
    restore(): Syllabus;
    rename(newName: string): Syllabus;
}
//# sourceMappingURL=syllabus.entity.d.ts.map