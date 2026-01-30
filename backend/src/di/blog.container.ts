import { container } from "tsyringe";

import type { IBlogRepository } from "../modules/blog/repository/blog.repository.interface.js";
import { BlogRepository } from "../modules/blog/repository/blog.repository.js";

import type { IGetAllBlogUseCase } from "../modules/blog/use-cases/interfaces/get.all.blog.use-case.interface.js";
import { GetAllBlogUseCase } from "../modules/blog/use-cases/get.all.blog.use-case.js";

import type { ICreateBlogUseCase } from "../modules/blog/use-cases/interfaces/create.blog.use-case.interface.js";
import { CreateBlogUseCase } from "../modules/blog/use-cases/create.blog.use-case.js";

import type { IEditBlogUseCase } from "../modules/blog/use-cases/interfaces/edit.blog.use-case.interface.js";
import { EditBlogUseCase } from "../modules/blog/use-cases/edit.blog.use-case.js";

import type { IBlockBlogUseCase } from "../modules/blog/use-cases/interfaces/block.blog.use-case.interface.js";
import { BlockBlogUseCase } from "../modules/blog/use-cases/block.blog.use-case.js";

import type { IUnblockBlogUseCase } from "../modules/blog/use-cases/interfaces/unblock.blog.use-case.interface.js";
import { UnblockBlogUseCase } from "../modules/blog/use-cases/unblock.blog.use-case.js";
import type { IGetBlogDetailsUseCase } from "../modules/blog/use-cases/interfaces/get.blog.details.use-case.interface.js";
import { GetBlogDetailsUseCase } from "../modules/blog/use-cases/get.blog.details.use-case.js";

export const registerBlogDependencies = () => {
  container.register<IBlogRepository>("IBlogRepository", {
    useClass: BlogRepository,
  });

  container.register<IGetAllBlogUseCase>("IGetAllBlogUseCase", {
    useClass: GetAllBlogUseCase,
  });

  container.register<ICreateBlogUseCase>("ICreateBlogUseCase", {
    useClass: CreateBlogUseCase,
  });

  container.register<IEditBlogUseCase>("IEditBlogUseCase", {
    useClass: EditBlogUseCase,
  });

  container.register<IBlockBlogUseCase>("IBlockBlogUseCase", {
    useClass: BlockBlogUseCase,
  });

  container.register<IUnblockBlogUseCase>("IUnblockBlogUseCase", {
    useClass: UnblockBlogUseCase,
  });

  container.register<IGetBlogDetailsUseCase>("IGetBlogDetailsUseCase", {
    useClass: GetBlogDetailsUseCase,
  });
};
