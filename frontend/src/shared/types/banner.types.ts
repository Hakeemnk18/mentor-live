export interface BannerImage {
  url: string;
  publicId: string;
}

export interface Banner {
  id: string;
  image: BannerImage;
  description: string;
  priority: number;
  isDeleted: boolean;
}

export interface BannerPayload {
  image: BannerImage;
  description: string;
  priority: number;
}
