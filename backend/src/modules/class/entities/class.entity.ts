export interface ClassProps {
  id: string | null;
  name: string;
  isDeleted?: boolean;
}

export class Class {
  public readonly id: string | null;
  public readonly name: string;
  public readonly isDeleted: boolean;

  constructor(props: ClassProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Class {
    if (this.isDeleted) {
      throw new Error("Class already deleted");
    }

    return new Class({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Class {
    if (!this.isDeleted) {
      throw new Error("Class is not deleted");
    }

    return new Class({
      ...this,
      isDeleted: false,
    });
  }

  
  rename(newName: string): Class {
    const name = newName.trim();

    if (!name) {
      throw new Error("Class name cannot be empty");
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error("Class name must be between 2 and 100 characters");
    }

    return new Class({
      ...this,
      name,
    });
  }
}