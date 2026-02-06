export interface TestimonialProps {
  id: string | null;
  author: string;
  designation: string;
  comment: string;
  isDeleted?: boolean;
}

export class Testimonial {
  public readonly id: string | null;
  public readonly author: string;
  public readonly designation: string;
  public readonly comment: string;
  public readonly isDeleted: boolean;

  constructor(props: TestimonialProps) {
    this.id = props.id;
    this.author = props.author;
    this.designation = props.designation;
    this.comment = props.comment;
    this.isDeleted = props.isDeleted ?? false;
  }

  /** ✍️ Update author name */
  updateAuthor(author: string): Testimonial {
    if (!author.trim()) {
      throw new Error("Testimonial author is required");
    }

    return new Testimonial({
      ...this,
      author: author.trim(),
    });
  }

  /** 🧑‍💼 Update designation */
  updateDesignation(designation: string): Testimonial {
    if (!designation.trim()) {
      throw new Error("Testimonial designation is required");
    }

    return new Testimonial({
      ...this,
      designation: designation.trim(),
    });
  }

  /** 💬 Update testimonial comment */
  updateComment(comment: string): Testimonial {
    if (!comment.trim()) {
      throw new Error("Testimonial comment is required");
    }

    return new Testimonial({
      ...this,
      comment: comment.trim(),
    });
  }

  /** 🗑️ Soft delete */
  delete(): Testimonial {
    if (this.isDeleted) {
      throw new Error("Testimonial already deleted");
    }

    return new Testimonial({
      ...this,
      isDeleted: true,
    });
  }
}
