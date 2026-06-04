export class Banner {
    id;
    image;
    description;
    priority;
    isShow;
    isClickable;
    buttonText;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.image = props.image;
        this.description = props.description;
        this.priority = props.priority ?? null;
        this.isShow = props.isShow ?? false;
        this.isClickable = props.isClickable ?? false;
        this.buttonText = props.buttonText ?? "Get In Touch";
        this.isDeleted = props.isDeleted ?? false;
    }
    show(priority) {
        return new Banner({ ...this, isShow: true, priority });
    }
    hide() {
        return new Banner({ ...this, isShow: false });
    }
    changePriority(priority) {
        if (priority < 1 || priority > 5) {
            throw new Error("Banner priority must be between 1 and 5");
        }
        return new Banner({ ...this, priority });
    }
    updateDescription(description) {
        if (!description.trim())
            throw new Error("Banner description is required");
        return new Banner({ ...this, description: description.trim() });
    }
    updateImage(image) {
        return new Banner({ ...this, image });
    }
    delete() {
        if (this.isDeleted)
            throw new Error("Banner already deleted");
        return new Banner({ ...this, isDeleted: true });
    }
}
//# sourceMappingURL=banner.entity.js.map