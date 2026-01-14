export interface SubjectVariantProps {
  id: string | null;
  subjectId: string;
  classId: string;
  syllabusId: string;
  isDeleted?: boolean;
}

export class SubjectVariant {
  public readonly id: string | null;
  public readonly subjectId: string;
  public readonly classId: string;
  public readonly syllabusId: string;
  public readonly isDeleted: boolean;

  constructor(props: SubjectVariantProps) {
    this.id = props.id;
    this.subjectId = props.subjectId;
    this.classId = props.classId;
    this.syllabusId = props.syllabusId;
    this.isDeleted = props.isDeleted ?? false;

    if (!this.subjectId || !this.classId || !this.syllabusId) {
      throw new Error("Subject, class, and syllabus are required");
    }
  }

  delete(): SubjectVariant {
    if (this.isDeleted) {
      throw new Error("Subject variant already deleted");
    }

    return new SubjectVariant({
      ...this,
      isDeleted: true,
    });
  }

  restore(): SubjectVariant {
    if (!this.isDeleted) {
      throw new Error("Subject variant is not deleted");
    }

    return new SubjectVariant({
      ...this,
      isDeleted: false,
    });
  }
}
