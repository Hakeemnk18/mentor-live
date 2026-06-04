import { Blog } from "../entities/blog.entity.js";
export class BlogMapper {
    static toDomain(blogModelData) {
        if (!blogModelData)
            return null;
        const idString = blogModelData._id?.toString() || blogModelData.id?.toString();
        if (!idString) {
            console.error("Blog data from DB is missing an ID:", blogModelData);
            return null;
        }
        return new Blog({
            id: idString,
            slug: blogModelData.slug,
            author: blogModelData.author,
            heading: blogModelData.heading,
            description: blogModelData.description,
            content: blogModelData.content,
            image: blogModelData.image?.url
                ? { url: blogModelData.image.url, publicId: blogModelData.image.publicId }
                : null,
            priority: blogModelData.priority ?? null,
            topic: blogModelData.topic ?? null,
            isFeatured: blogModelData.isFeatured ?? false,
            isDeleted: blogModelData.isDeleted ?? false,
        });
    }
    static toPersistence(blogEntity) {
        return {
            slug: blogEntity.slug,
            author: blogEntity.author,
            heading: blogEntity.heading,
            description: blogEntity.description,
            content: blogEntity.content,
            image: blogEntity.image ?? null,
            priority: blogEntity.priority,
            topic: blogEntity.topic,
            isFeatured: blogEntity.isFeatured,
            isDeleted: blogEntity.isDeleted,
        };
    }
    static toListItem(doc) {
        return {
            id: doc._id.toString(),
            slug: doc.slug,
            heading: doc.heading,
            description: doc.description,
            author: doc.author,
            image: doc.image?.url
                ? { url: doc.image.url, publicId: doc.image.publicId }
                : null,
            priority: doc.priority ?? null,
            topic: doc.topic ?? null,
            isFeatured: doc.isFeatured ?? false,
            isDeleted: doc.isDeleted ?? false,
        };
    }
}
//# sourceMappingURL=blog.mapper.js.map