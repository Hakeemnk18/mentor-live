export interface BannerProps {
  id: string | null;
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  priority: number;
  isDeleted?: boolean;
}

export class Banner {
  public readonly id: string | null;
  public readonly image: {
    url: string;
    publicId: string;
  };
  public readonly description: string;
  public readonly priority: number;
  public readonly isDeleted: boolean;

  constructor(props: BannerProps) {
    this.id = props.id;
    this.image = props.image;
    this.description = props.description;
    this.priority = props.priority;
    this.isDeleted = props.isDeleted ?? false;
  }

  /** 🔼 Change banner priority */
  changePriority(priority: number): Banner {
    if (priority < 1) {
      throw new Error("Banner priority must be >= 1");
    }

    return new Banner({
      ...this,
      priority,
    });
  }

  /** 📝 Update description */
  updateDescription(description: string): Banner {
    if (!description.trim()) {
      throw new Error("Banner description is required");
    }

    return new Banner({
      ...this,
      description: description.trim(),
    });
  }

  /** 🖼️ Replace banner image */
  updateImage(image: { url: string; publicId: string }): Banner {
    return new Banner({
      ...this,
      image,
    });
  }

  /** 🗑️ Soft delete (future use) */
  delete(): Banner {
    if (this.isDeleted) {
      throw new Error("Banner already deleted");
    }

    return new Banner({
      ...this,
      isDeleted: true,
    });
  }
}
