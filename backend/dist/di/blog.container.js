import { container } from "tsyringe";
import { BlogRepository } from "../modules/blog/repository/blog.repository.js";
import { GetAllBlogUseCase } from "../modules/blog/use-cases/get.all.blog.use-case.js";
import { CreateBlogUseCase } from "../modules/blog/use-cases/create.blog.use-case.js";
import { EditBlogUseCase } from "../modules/blog/use-cases/edit.blog.use-case.js";
import { BlockBlogUseCase } from "../modules/blog/use-cases/block.blog.use-case.js";
import { UnblockBlogUseCase } from "../modules/blog/use-cases/unblock.blog.use-case.js";
import { GetBlogDetailsUseCase } from "../modules/blog/use-cases/get.blog.details.use-case.js";
export const registerBlogDependencies = () => {
    container.register("IBlogRepository", {
        useClass: BlogRepository,
    });
    container.register("IGetAllBlogUseCase", {
        useClass: GetAllBlogUseCase,
    });
    container.register("ICreateBlogUseCase", {
        useClass: CreateBlogUseCase,
    });
    container.register("IEditBlogUseCase", {
        useClass: EditBlogUseCase,
    });
    container.register("IBlockBlogUseCase", {
        useClass: BlockBlogUseCase,
    });
    container.register("IUnblockBlogUseCase", {
        useClass: UnblockBlogUseCase,
    });
    container.register("IGetBlogDetailsUseCase", {
        useClass: GetBlogDetailsUseCase,
    });
};
//# sourceMappingURL=blog.container.js.map