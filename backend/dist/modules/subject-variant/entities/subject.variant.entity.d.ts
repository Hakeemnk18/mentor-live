export interface SubjectVariantProps {
    id: string | null;
    subjectId: string;
    classId: string;
    syllabusId: string;
    isDeleted?: boolean;
}
export declare class SubjectVariant {
    readonly id: string | null;
    readonly subjectId: string;
    readonly classId: string;
    readonly syllabusId: string;
    readonly isDeleted: boolean;
    constructor(props: SubjectVariantProps);
    delete(): SubjectVariant;
    restore(): SubjectVariant;
}
//# sourceMappingURL=subject.variant.entity.d.ts.map