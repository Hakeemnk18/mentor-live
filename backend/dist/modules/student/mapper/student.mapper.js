import { Student } from "../entities/student.entity.js";
export class StudentMapper {
    static toDomain(studentModelData) {
        if (!studentModelData) {
            return null;
        }
        const idString = studentModelData._id?.toString() || studentModelData.id?.toString();
        if (!idString) {
            console.error("Student data from DB is missing an ID:", studentModelData);
            return null;
        }
        return new Student({
            id: idString,
            name: studentModelData.name,
            class: studentModelData.class,
            place: studentModelData.place,
            phoneNumber: studentModelData.phoneNumber,
            school: studentModelData.school,
            syllabus: studentModelData.syllabus,
            isDeleted: studentModelData.isDeleted,
        });
    }
    static toPersistence(studentEntity) {
        return {
            name: studentEntity.name,
            class: studentEntity.class,
            place: studentEntity.place,
            phoneNumber: studentEntity.phoneNumber,
            school: studentEntity.school,
            syllabus: studentEntity.syllabus,
            isDeleted: studentEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=student.mapper.js.map