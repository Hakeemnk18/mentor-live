import { container } from "tsyringe";
import { BannerRepository } from "../modules/banner/repository/banner.repository.js";
import { CreateBannerUseCase } from "../modules/banner/use-cases/create.banner.use-case.js";
import { EditBannerUseCase } from "../modules/banner/use-cases/edit.banner.use-case.js";
import { DeleteBannerUseCase } from "../modules/banner/use-cases/delete.banner.use-case.js";
import { GetAllBannerUseCase } from "../modules/banner/use-cases/get.all.banner.use-case.js";
import { GetAllBannerForAdminUseCase } from "../modules/banner/use-cases/get.all.banner.for.admin.use-case.js";
import { ToggleBannerShowUseCase } from "../modules/banner/use-cases/toggle.banner.show.use-case.js";
export const registerBannerDependencies = () => {
    container.register("IBannerRepository", {
        useClass: BannerRepository,
    });
    container.register("ICreateBannerUseCase", {
        useClass: CreateBannerUseCase,
    });
    container.register("IEditBannerUseCase", {
        useClass: EditBannerUseCase,
    });
    container.register("IDeleteBannerUseCase", {
        useClass: DeleteBannerUseCase,
    });
    container.register("IGetAllBannerUseCase", {
        useClass: GetAllBannerUseCase,
    });
    container.register("IGetAllBannerForAdminUseCase", { useClass: GetAllBannerForAdminUseCase });
    container.register("IToggleBannerShowUseCase", {
        useClass: ToggleBannerShowUseCase,
    });
};
//# sourceMappingURL=banner.container.js.map