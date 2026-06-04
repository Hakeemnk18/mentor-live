import { Banner } from "../entities/banner.entity.js";
export class BannerMapper {
    static toDomain(bannerModelData) {
        if (!bannerModelData)
            return null;
        const idString = bannerModelData._id?.toString() || bannerModelData.id?.toString();
        if (!idString) {
            console.error("Banner data from DB is missing an ID:", bannerModelData);
            return null;
        }
        return new Banner({
            id: idString,
            image: {
                url: bannerModelData.image?.url,
                publicId: bannerModelData.image?.publicId,
            },
            description: bannerModelData.description,
            priority: bannerModelData.priority ?? null,
            isShow: bannerModelData.isShow ?? false,
            isClickable: bannerModelData.isClickable ?? false,
            buttonText: bannerModelData.buttonText ?? "Get In Touch",
            isDeleted: bannerModelData.isDeleted ?? false,
        });
    }
    static toPersistence(bannerEntity) {
        return {
            image: {
                url: bannerEntity.image.url,
                publicId: bannerEntity.image.publicId,
            },
            description: bannerEntity.description,
            priority: bannerEntity.priority,
            isShow: bannerEntity.isShow,
            isClickable: bannerEntity.isClickable,
            buttonText: bannerEntity.buttonText,
            isDeleted: bannerEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=banner.mapper.js.map