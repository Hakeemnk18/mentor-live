import { Faculty } from "../entities/faculty.entity.js"; 

export interface IFacultyRepository {
  create(facultyEntity: Faculty): Promise<Faculty>;
  findById(id: string): Promise<Faculty | null>;
  findByName(name: string): Promise<Faculty | null>;
  save(facultyEntity: Faculty): Promise<Faculty>;
}