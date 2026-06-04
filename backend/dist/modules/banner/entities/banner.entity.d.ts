export interface BannerProps {
    id: string | null;
    image: {
        url: string;
        publicId: string;
    };
    description: string;
    priority: number | null;
    isShow?: boolean;
    isClickable?: boolean;
    buttonText?: string;
    isDeleted?: boolean;
}
export declare class Banner {
    readonly id: string | null;
    readonly image: {
        url: string;
        publicId: string;
    };
    readonly description: string;
    readonly priority: number | null;
    readonly isShow: boolean;
    readonly isClickable: boolean;
    readonly buttonText: string;
    readonly isDeleted: boolean;
    constructor(props: BannerProps);
    show(priority: number): Banner;
    hide(): Banner;
    changePriority(priority: number): Banner;
    updateDescription(description: string): Banner;
    updateImage(image: {
        url: string;
        publicId: string;
    }): Banner;
    delete(): Banner;
}
//# sourceMappingURL=banner.entity.d.ts.map