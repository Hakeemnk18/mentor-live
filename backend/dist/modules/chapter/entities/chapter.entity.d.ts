import type { ImageValue } from "../../../core/shared/type/image.type.js";
export interface ChapterProps {
    id: string | null;
    icon: ImageValue;
    name: string;
    price: number;
    subjectVariant: string;
    isDeleted?: boolean;
}
export declare class Chapter {
    readonly id: string | null;
    readonly icon: ImageValue;
    readonly name: string;
    readonly price: number;
    readonly subjectVariant: string;
    readonly isDeleted: boolean;
    constructor(props: ChapterProps);
    delete(): Chapter;
    restore(): Chapter;
}
//# sourceMappingURL=chapter.entity.d.ts.map