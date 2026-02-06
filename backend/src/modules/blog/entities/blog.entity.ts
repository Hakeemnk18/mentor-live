export interface BlogProps {
  id: string | null;
  slug: string;
  author: string;
  heading: string;
  description: string;
  content: string;
  isDeleted?: boolean;
}

export class Blog {
  public readonly id: string | null;
  public readonly slug: string;
  public readonly author: string;
  public readonly heading: string;
  public readonly description: string;
  public readonly content: string;
  public readonly isDeleted: boolean;

  constructor(props: BlogProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.author = props.author;
    this.heading = props.heading;
    this.description = props.description;
    this.content = props.content;
    this.isDeleted = props.isDeleted ?? false;
  }

  /** ✍️ Update heading */
  updateHeading(heading: string): Blog {
    if (!heading.trim()) {
      throw new Error("Blog heading is required");
    }

    return new Blog({
      ...this,
      heading: heading.trim(),
    });
  }

  /** 📝 Update description */
  updateDescription(description: string): Blog {
    if (!description.trim()) {
      throw new Error("Blog description is required");
    }

    return new Blog({
      ...this,
      description: description.trim(),
    });
  }

 
  updateContent(content: string): Blog {
    if (!content.trim()) {
      throw new Error("Blog content is required");
    }

    return new Blog({
      ...this,
      content: content.trim(),
    });
  }

  
  delete(): Blog {
    if (this.isDeleted) {
      throw new Error("Blog already deleted");
    }

    return new Blog({
      ...this,
      isDeleted: true,
    });
  }

  restore(): Blog {
    if (!this.isDeleted) {
      throw new Error("Blog already unblocked");
    }

    return new Blog({
      ...this,
      isDeleted: false,
    });
  }
}