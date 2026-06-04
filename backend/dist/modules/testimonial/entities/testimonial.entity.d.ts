export interface TestimonialProps {
    id: string | null;
    author: string;
    designation: string;
    comment: string;
    isDeleted?: boolean;
}
export declare class Testimonial {
    readonly id: string | null;
    readonly author: string;
    readonly designation: string;
    readonly comment: string;
    readonly isDeleted: boolean;
    constructor(props: TestimonialProps);
    /** ✍️ Update author name */
    updateAuthor(author: string): Testimonial;
    /** 🧑‍💼 Update designation */
    updateDesignation(designation: string): Testimonial;
    /** 💬 Update testimonial comment */
    updateComment(comment: string): Testimonial;
    /** 🗑️ Soft delete */
    delete(): Testimonial;
}
//# sourceMappingURL=testimonial.entity.d.ts.map