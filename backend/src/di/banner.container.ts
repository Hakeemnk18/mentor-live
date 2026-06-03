import { container } from "tsyringe";

import { BannerRepository } from "../modules/banner/repository/banner.repository.js";
import type { IBannerRepository } from "../modules/banner/repository/banner.repository.interface.js";

import type { ICreateBannerUseCase } from "../modules/banner/use-cases/interfaces/create.banner.use-case.interface.js";
import { CreateBannerUseCase } from "../modules/banner/use-cases/create.banner.use-case.js";

import type { IEditBannerUseCase } from "../modules/banner/use-cases/interfaces/edit.banner.use-case.interface.js";
import { EditBannerUseCase } from "../modules/banner/use-cases/edit.banner.use-case.js";

import type { IDeleteBannerUseCase } from "../modules/banner/use-cases/interfaces/delete.banner.use-case.interface.js";
import { DeleteBannerUseCase } from "../modules/banner/use-cases/delete.banner.use-case.js";

import type { IGetAllBannerUseCase } from "../modules/banner/use-cases/interfaces/get.all.banner.use-case.interface.js";
import { GetAllBannerUseCase } from "../modules/banner/use-cases/get.all.banner.use-case.js";

import type { IGetAllBannerForAdminUseCase } from "../modules/banner/use-cases/interfaces/get.all.banner.for.admin.use-case.interface.js";
import { GetAllBannerForAdminUseCase } from "../modules/banner/use-cases/get.all.banner.for.admin.use-case.js";

import type { IToggleBannerShowUseCase } from "../modules/banner/use-cases/interfaces/toggle.banner.show.use-case.interface.js";
import { ToggleBannerShowUseCase } from "../modules/banner/use-cases/toggle.banner.show.use-case.js";

export const registerBannerDependencies = () => {
  container.register<IBannerRepository>("IBannerRepository", {
    useClass: BannerRepository,
  });

  container.register<ICreateBannerUseCase>("ICreateBannerUseCase", {
    useClass: CreateBannerUseCase,
  });

  container.register<IEditBannerUseCase>("IEditBannerUseCase", {
    useClass: EditBannerUseCase,
  });

  container.register<IDeleteBannerUseCase>("IDeleteBannerUseCase", {
    useClass: DeleteBannerUseCase,
  });

  container.register<IGetAllBannerUseCase>("IGetAllBannerUseCase", {
    useClass: GetAllBannerUseCase,
  });

  container.register<IGetAllBannerForAdminUseCase>(
    "IGetAllBannerForAdminUseCase",
    { useClass: GetAllBannerForAdminUseCase },
  );

  container.register<IToggleBannerShowUseCase>("IToggleBannerShowUseCase", {
    useClass: ToggleBannerShowUseCase,
  });
};
