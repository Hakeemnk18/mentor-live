import { Lead } from "../entities/lead.entity.js";
export class LeadMapper {
    static toDomain(data) {
        if (!data)
            return null;
        const idString = data._id?.toString() || data.id?.toString();
        if (!idString) {
            console.error("Lead data from DB is missing an ID:", data);
            return null;
        }
        return new Lead({
            id: idString,
            name: data.name,
            phone: data.phone,
            email: data.email ?? null,
            message: data.message ?? null,
            purpose: data.purpose,
            type: data.type,
            status: data.status ?? "new",
            classId: data.classId ?? null,
            syllabusId: data.syllabusId ?? null,
            className: data.className ?? null,
            syllabusName: data.syllabusName ?? null,
        });
    }
    static toPersistence(lead) {
        return {
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            message: lead.message,
            purpose: lead.purpose,
            type: lead.type,
            status: lead.status,
            classId: lead.classId,
            syllabusId: lead.syllabusId,
            className: lead.className,
            syllabusName: lead.syllabusName,
        };
    }
    static toListItem(doc) {
        return {
            id: doc._id.toString(),
            name: doc.name,
            phone: doc.phone,
            email: doc.email ?? null,
            message: doc.message ?? null,
            purpose: doc.purpose,
            type: doc.type,
            status: doc.status ?? "new",
            classId: doc.classId ?? null,
            syllabusId: doc.syllabusId ?? null,
            className: doc.className ?? null,
            syllabusName: doc.syllabusName ?? null,
            createdAt: doc.createdAt,
        };
    }
}
//# sourceMappingURL=lead.mapper.js.map