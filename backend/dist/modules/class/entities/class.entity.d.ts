export interface ClassProps {
    id: string | null;
    name: string;
    isDeleted?: boolean;
}
export declare class Class {
    readonly id: string | null;
    readonly name: string;
    readonly isDeleted: boolean;
    constructor(props: ClassProps);
    delete(): Class;
    restore(): Class;
    rename(newName: string): Class;
}
//# sourceMappingURL=class.entity.d.ts.map