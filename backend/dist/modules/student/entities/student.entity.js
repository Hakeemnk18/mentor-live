export class Student {
    id;
    name;
    class;
    place;
    phoneNumber;
    school;
    syllabus;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.name = props.name.trim();
        this.class = props.class;
        this.place = props.place.trim();
        this.phoneNumber = props.phoneNumber.trim();
        this.school = props.school.trim();
        this.syllabus = props.syllabus;
        this.isDeleted = props.isDeleted ?? false;
    }
    delete() {
        if (this.isDeleted) {
            throw new Error("Student already deleted");
        }
        return new Student({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Student is not deleted");
        }
        return new Student({
            ...this,
            isDeleted: false,
        });
    }
    rename(newName) {
        const name = newName.trim();
        if (!name) {
            throw new Error("Student name cannot be empty");
        }
        if (name.length < 2 || name.length > 100) {
            throw new Error("Student name must be between 2 and 100 characters");
        }
        return new Student({
            ...this,
            name,
        });
    }
    changeClassAndName(classId, syllabus) {
        return new Student({
            ...this,
            class: classId,
            syllabus
        });
    }
}
//# sourceMappingURL=student.entity.js.map