import { Blog } from "../entities/blog.entity.js";
import type { BlogListItem } from "../type/blog.type.js";

export class BlogMapper {
  static toDomain(blogModelData: any): Blog | null {
    if (!blogModelData) {
      return null;
    }

    const idString =
      blogModelData._id?.toString() || blogModelData.id?.toString();

    if (!idString) {
      console.error(
        "Blog data from DB is missing an ID:",
        blogModelData
      );
      return null;
    }

    return new Blog({
      id: idString,
      slug: blogModelData.slug,
      author: blogModelData.author,
      heading: blogModelData.heading,
      description: blogModelData.description,
      content: blogModelData.content,
      isDeleted: blogModelData.isDeleted,
    });
  }

  static toPersistence(blogEntity: Blog): any {
    return {
      slug: blogEntity.slug,
      author: blogEntity.author,
      heading: blogEntity.heading,
      description: blogEntity.description,
      content: blogEntity.content,
      isDeleted: blogEntity.isDeleted,
    };
  }

  static toListItem(doc: any): BlogListItem {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    heading: doc.heading,
    description: doc.description,
    author: doc.author,
    isDeleted: doc.isDeleted,
  };
}
}
