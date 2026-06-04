export class Blog {
    id;
    slug;
    author;
    heading;
    description;
    content;
    image;
    priority;
    topic;
    isFeatured;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.slug = props.slug;
        this.author = props.author;
        this.heading = props.heading;
        this.description = props.description;
        this.content = props.content;
        this.image = props.image ?? null;
        this.priority = props.priority ?? null;
        this.topic = props.topic ?? null;
        this.isFeatured = props.isFeatured ?? false;
        this.isDeleted = props.isDeleted ?? false;
    }
    updateHeading(heading) {
        if (!heading.trim())
            throw new Error("Blog heading is required");
        return new Blog({ ...this, heading: heading.trim() });
    }
    updateDescription(description) {
        if (!description.trim())
            throw new Error("Blog description is required");
        return new Blog({ ...this, description: description.trim() });
    }
    updateContent(content) {
        if (!content.trim())
            throw new Error("Blog content is required");
        return new Blog({ ...this, content: content.trim() });
    }
    delete() {
        if (this.isDeleted)
            throw new Error("Blog already deleted");
        return new Blog({ ...this, isDeleted: true });
    }
    restore() {
        if (!this.isDeleted)
            throw new Error("Blog already unblocked");
        return new Blog({ ...this, isDeleted: false });
    }
}
//# sourceMappingURL=blog.entity.js.map