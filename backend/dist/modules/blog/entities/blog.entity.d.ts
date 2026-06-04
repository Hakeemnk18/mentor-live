export interface BlogProps {
    id: string | null;
    slug: string;
    author: string;
    heading: string;
    description: string;
    content: string;
    image?: {
        url: string;
        publicId: string;
    } | null;
    priority?: number | null;
    topic?: string | null;
    isFeatured?: boolean;
    isDeleted?: boolean;
}
export declare class Blog {
    readonly id: string | null;
    readonly slug: string;
    readonly author: string;
    readonly heading: string;
    readonly description: string;
    readonly content: string;
    readonly image: {
        url: string;
        publicId: string;
    } | null;
    readonly priority: number | null;
    readonly topic: string | null;
    readonly isFeatured: boolean;
    readonly isDeleted: boolean;
    constructor(props: BlogProps);
    updateHeading(heading: string): Blog;
    updateDescription(description: string): Blog;
    updateContent(content: string): Blog;
    delete(): Blog;
    restore(): Blog;
}
//# sourceMappingURL=blog.entity.d.ts.map