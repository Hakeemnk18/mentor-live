export interface SubjectProps {
    id: string | null;
    name: string;
    isDeleted?: boolean;
}
export declare class Subject {
    readonly id: string | null;
    readonly name: string;
    readonly isDeleted: boolean;
    constructor(props: SubjectProps);
    delete(): Subject;
    restore(): Subject;
    rename(newName: string): Subject;
}
//# sourceMappingURL=subject.entity.d.ts.map