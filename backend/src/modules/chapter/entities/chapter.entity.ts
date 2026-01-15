export interface ChapterProps {
  id: string | null;
  icon: string;
  name: string;
  price: number;
  subjectVariant: string;   // ObjectId as string in domain
  isDeleted?: boolean;
}

export class Chapter {
  public readonly id: string | null;
  public readonly icon: string;
  public readonly name: string;
  public readonly price: number;
  public readonly subjectVariant: string;
  public readonly isDeleted: boolean;

  constructor(props: ChapterProps) {
    const name = props.name.trim();

    if (!name) {
      throw new Error("Chapter name cannot be empty");
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error("Chapter name must be between 2 and 100 characters");
    }

    if (props.price < 0) {
      throw new Error("Chapter price cannot be negative");
    }

    if (!props.subjectVariant) {
      throw new Error("Chapter must belong to a subject variant");
    }

    this.id = props.id;
    this.icon = props.icon;
    this.name = name;
    this.price = props.price;
    this.subjectVariant = props.subjectVariant;
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Chapter {
    if (this.isDeleted) {
      throw new Error("Chapter already deleted");
    }

    return new Chapter({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Chapter {
    if (!this.isDeleted) {
      throw new Error("Chapter is not deleted");
    }

    return new Chapter({
      ...this,
      isDeleted: false,
    });
  }
}
