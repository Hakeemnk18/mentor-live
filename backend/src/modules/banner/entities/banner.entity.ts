export interface BannerProps {
  id: string | null;
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  priority: number | null;
  isShow?: boolean;
  isClickable?: boolean;
  buttonText?: string;
  isDeleted?: boolean;
}

export class Banner {
  public readonly id: string | null;
  public readonly image: { url: string; publicId: string };
  public readonly description: string;
  public readonly priority: number | null;
  public readonly isShow: boolean;
  public readonly isClickable: boolean;
  public readonly buttonText: string;
  public readonly isDeleted: boolean;

  constructor(props: BannerProps) {
    this.id = props.id;
    this.image = props.image;
    this.description = props.description;
    this.priority = props.priority ?? null;
    this.isShow = props.isShow ?? false;
    this.isClickable = props.isClickable ?? false;
    this.buttonText = props.buttonText ?? "Get In Touch";
    this.isDeleted = props.isDeleted ?? false;
  }

  show(priority: number): Banner {
    return new Banner({ ...this, isShow: true, priority });
  }

  hide(): Banner {
    return new Banner({ ...this, isShow: false });
  }

  changePriority(priority: number): Banner {
    if (priority < 1 || priority > 5) {
      throw new Error("Banner priority must be between 1 and 5");
    }
    return new Banner({ ...this, priority });
  }

  updateDescription(description: string): Banner {
    if (!description.trim()) throw new Error("Banner description is required");
    return new Banner({ ...this, description: description.trim() });
  }

  updateImage(image: { url: string; publicId: string }): Banner {
    return new Banner({ ...this, image });
  }

  delete(): Banner {
    if (this.isDeleted) throw new Error("Banner already deleted");
    return new Banner({ ...this, isDeleted: true });
  }
}
