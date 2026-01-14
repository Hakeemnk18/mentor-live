export interface SubjectProps {
  id: string | null;
  name: string;
  isDeleted?: boolean;
}

export class Subject {
  public readonly id: string | null;
  public readonly name: string;
  public readonly isDeleted: boolean;

  constructor(props: SubjectProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Subject {
    if (this.isDeleted) {
      throw new Error("Subject already deleted");
    }

    return new Subject({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Subject {
    if (!this.isDeleted) {
      throw new Error("Subject is not deleted");
    }

    return new Subject({
      ...this,
      isDeleted: false,
    });
  }

  rename(newName: string): Subject {
    const name = newName.trim();

    if (!name) {
      throw new Error("Subject name cannot be empty");
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error("Subject name must be between 2 and 100 characters");
    }

    return new Subject({
      ...this,
      name,
    });
  }
}
