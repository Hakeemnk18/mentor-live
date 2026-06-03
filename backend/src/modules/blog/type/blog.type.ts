export interface BlogListItem {
  id: string;
  slug: string;
  heading: string;
  description: string;
  author: string;
  image: { url: string; publicId: string } | null;
  priority: number | null;
  topic: string | null;
  isFeatured: boolean;
  isDeleted: boolean;
}
