export class Class {
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
            throw new Error("Class already deleted");
        }
        return new Class({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Class is not deleted");
        }
        return new Class({
            ...this,
            isDeleted: false,
        });
    }
    rename(newName) {
        const name = newName.trim();
        if (!name) {
            throw new Error("Class name cannot be empty");
        }
        if (name.length < 2 || name.length > 100) {
            throw new Error("Class name must be between 2 and 100 characters");
        }
        return new Class({
            ...this,
            name,
        });
    }
}
//# sourceMappingURL=class.entity.js.map