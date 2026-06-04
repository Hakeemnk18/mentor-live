export class SubjectVariant {
    id;
    subjectId;
    classId;
    syllabusId;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.subjectId = props.subjectId;
        this.classId = props.classId;
        this.syllabusId = props.syllabusId;
        this.isDeleted = props.isDeleted ?? false;
        if (!this.subjectId || !this.classId || !this.syllabusId) {
            throw new Error("Subject, class, and syllabus are required");
        }
    }
    delete() {
        if (this.isDeleted) {
            throw new Error("Subject variant already deleted");
        }
        return new SubjectVariant({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Subject variant is not deleted");
        }
        return new SubjectVariant({
            ...this,
            isDeleted: false,
        });
    }
}
//# sourceMappingURL=subject.variant.entity.js.map