export class Subject {
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
            throw new Error("Subject already deleted");
        }
        return new Subject({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Subject is not deleted");
        }
        return new Subject({
            ...this,
            isDeleted: false,
        });
    }
    rename(newName) {
        const name = newName.trim();
        if (!name) {
            throw new Error("Subject name cannot be empty");
        }
        if (name.length < 2 || name.length > 100) {
            throw new Error("Subject name must be between 2 and 100 characters");
        }
        return new Subject({
            ...this,
            name,
        });
    }
}
//# sourceMappingURL=subject.entity.js.map