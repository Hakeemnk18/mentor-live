export interface StudentProps {
    id: string | null;
    name: string;
    class: string;
    place: string;
    phoneNumber: string;
    school: string;
    syllabus: string;
    isDeleted?: boolean;
}
export declare class Student {
    readonly id: string | null;
    readonly name: string;
    readonly class: string;
    readonly place: string;
    readonly phoneNumber: string;
    readonly school: string;
    readonly syllabus: string;
    readonly isDeleted: boolean;
    constructor(props: StudentProps);
    delete(): Student;
    restore(): Student;
    rename(newName: string): Student;
    changeClassAndName(classId: string, syllabus: string): Student;
}
//# sourceMappingURL=student.entity.d.ts.map