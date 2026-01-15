import { container } from "tsyringe";

import type { IChapterRepository } from "../modules/chapter/repositories/chapter.repository.interface.js";
import { ChapterRepository } from "../modules/chapter/repositories/chapter.repository.js";

import type { ICreateChapterUseCase } from "../modules/chapter/use-cases/interfaces/create.chapter.use-case.interface.js";
import { CreateChapterUseCase } from "../modules/chapter/use-cases/create.chapter.use-case.js";

import type { IEditChapterUseCase } from "../modules/chapter/use-cases/interfaces/edit.chapter.use-case.interface.js";
import { EditChapterUseCase } from "../modules/chapter/use-cases/edit.chapter.use-case.js";

import type { IGetChaptersForUserUseCase } from "../modules/chapter/use-cases/interfaces/get.all.for.user.use-case.interface.js";
import { GetChaptersForUserUseCase } from "../modules/chapter/use-cases/get.all.for.user.use-case.js";

import type { IGetChaptersForAdminUseCase } from "../modules/chapter/use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import { GetChaptersForAdminUseCase } from "../modules/chapter/use-cases/get.all.for.admin.use-case.js";

import type { IBlockChapterUseCase } from "../modules/chapter/use-cases/interfaces/block.chapter.use-case.interface.js";
import { BlockChapterUseCase } from "../modules/chapter/use-cases/block.chapter.use-case.js";

import type { IUnblockChapterUseCase } from "../modules/chapter/use-cases/interfaces/unblock.chapter.use-case.interface.js";
import { UnblockChapterUseCase } from "../modules/chapter/use-cases/unblock.chapter.use-case.js";

export const registerChapterDependencies = () => {
  container.register<IChapterRepository>("IChapterRepository", {
    useClass: ChapterRepository,
  });

  container.register<ICreateChapterUseCase>("ICreateChapterUseCase", {
    useClass: CreateChapterUseCase,
  });

  container.register<IEditChapterUseCase>("IEditChapterUseCase", {
    useClass: EditChapterUseCase,
  });

  container.register<IGetChaptersForUserUseCase>("IGetChaptersForUserUseCase", {
    useClass: GetChaptersForUserUseCase,
  });

  container.register<IGetChaptersForAdminUseCase>("IGetChaptersForAdminUseCase", {
    useClass: GetChaptersForAdminUseCase,
  });

  container.register<IBlockChapterUseCase>("IBlockChapterUseCase", {
    useClass: BlockChapterUseCase,
  });

  container.register<IUnblockChapterUseCase>("IUnblockChapterUseCase", {
    useClass: UnblockChapterUseCase,
  });
};
