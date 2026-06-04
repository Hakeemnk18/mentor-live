export class Testimonial {
    id;
    author;
    designation;
    comment;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.author = props.author;
        this.designation = props.designation;
        this.comment = props.comment;
        this.isDeleted = props.isDeleted ?? false;
    }
    /** ✍️ Update author name */
    updateAuthor(author) {
        if (!author.trim()) {
            throw new Error("Testimonial author is required");
        }
        return new Testimonial({
            ...this,
            author: author.trim(),
        });
    }
    /** 🧑‍💼 Update designation */
    updateDesignation(designation) {
        if (!designation.trim()) {
            throw new Error("Testimonial designation is required");
        }
        return new Testimonial({
            ...this,
            designation: designation.trim(),
        });
    }
    /** 💬 Update testimonial comment */
    updateComment(comment) {
        if (!comment.trim()) {
            throw new Error("Testimonial comment is required");
        }
        return new Testimonial({
            ...this,
            comment: comment.trim(),
        });
    }
    /** 🗑️ Soft delete */
    delete() {
        if (this.isDeleted) {
            throw new Error("Testimonial already deleted");
        }
        return new Testimonial({
            ...this,
            isDeleted: true,
        });
    }
}
//# sourceMappingURL=testimonial.entity.js.map