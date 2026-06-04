import { Faculty } from "../entities/faculty.entity.js";
import type { FacultyDetailsViewForUser, FacultyView } from "../types/faculty.type.js";
export declare class FacultyMapper {
    static toDomain(facultyModelData: any): Faculty | null;
    static toPersistence(facultyEntity: Faculty): any;
    static toView(raw: any): FacultyView;
    static toFacultyUserView(doc: any): {
        id: any;
        name: any;
        qualifications: any;
        description: any;
        price: any;
        image: any;
    };
    static toFacultyWithSlotToUserView(doc: any): FacultyDetailsViewForUser;
}
//# sourceMappingURL=faculty.mapper.d.ts.map