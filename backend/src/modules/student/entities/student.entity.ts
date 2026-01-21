export interface StudentProps {
  id: string | null;
  name: string;
  class: string;
  place: string;
  phoneNumber: string;
  school: string;
  syllabus: string;
  isDeleted?: boolean;
}

export class Student {
  public readonly id: string | null;
  public readonly name: string;
  public readonly class: string;
  public readonly place: string;
  public readonly phoneNumber: string;
  public readonly school: string;
  public readonly syllabus: string;
  public readonly isDeleted: boolean;

  constructor(props: StudentProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.class = props.class.trim();
    this.place = props.place.trim();
    this.phoneNumber = props.phoneNumber.trim();
    this.school = props.school.trim();
    this.syllabus = props.syllabus.trim();
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Student {
    if (this.isDeleted) {
      throw new Error("Student already deleted");
    }

    return new Student({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Student {
    if (!this.isDeleted) {
      throw new Error("Student is not deleted");
    }

    return new Student({
      ...this,
      isDeleted: false,
    });
  }

  rename(newName: string): Student {
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
}
