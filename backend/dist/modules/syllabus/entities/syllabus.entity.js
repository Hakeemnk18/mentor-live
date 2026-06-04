export class Syllabus {
    id;
    name;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.name = props.name.trim();
        this.isDeleted = props.isDeleted ?? false;
    }
    delete() {
        if (this.isDeleted) {
            throw new Error("Syllabus already deleted");
        }
        return new Syllabus({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Syllabus is not deleted");
        }
        return new Syllabus({
            ...this,
            isDeleted: false,
        });
    }
    rename(newName) {
        const name = newName.trim();
        if (!name) {
            throw new Error("Syllabus name cannot be empty");
        }
        if (name.length < 2 || name.length > 100) {
            throw new Error("Syllabus name must be between 2 and 100 characters");
        }
        return new Syllabus({
            ...this,
            name,
        });
    }
}
//# sourceMappingURL=syllabus.entity.js.map