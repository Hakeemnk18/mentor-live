export interface SyllabusProps {
  id: string | null;
  name: string;
  isDeleted?: boolean;
}

export class Syllabus {
  public readonly id: string | null;
  public readonly name: string;
  public readonly isDeleted: boolean;

  constructor(props: SyllabusProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Syllabus {
    if (this.isDeleted) {
      throw new Error("Syllabus already deleted");
    }

    return new Syllabus({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Syllabus {
    if (!this.isDeleted) {
      throw new Error("Syllabus is not deleted");
    }

    return new Syllabus({
      ...this,
      isDeleted: false,
    });
  }

  rename(newName: string): Syllabus {
    const name = newName.trim();

    if (!name) {
      throw new Error("Syllabus name cannot be empty");
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error("Syllabus name must be between 2 and 100 characters");
    }

    return new Syllabus({
      ...this,
      name,
    });
  }
}
