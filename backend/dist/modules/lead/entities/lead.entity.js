export class Lead {
    id;
    name;
    phone;
    email;
    message;
    purpose;
    type;
    status;
    classId;
    syllabusId;
    className;
    syllabusName;
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.phone = props.phone;
        this.email = props.email ?? null;
        this.message = props.message ?? null;
        this.purpose = props.purpose;
        this.type = props.type;
        this.status = props.status ?? "new";
        this.classId = props.classId ?? null;
        this.syllabusId = props.syllabusId ?? null;
        this.className = props.className ?? null;
        this.syllabusName = props.syllabusName ?? null;
    }
    updateStatus(status) {
        return new Lead({ ...this, status });
    }
}
//# sourceMappingURL=lead.entity.js.map