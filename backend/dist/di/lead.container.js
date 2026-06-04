import { container } from "tsyringe";
import { LeadRepository } from "../modules/lead/repository/lead.repository.js";
import { CreateLeadUseCase } from "../modules/lead/use-cases/create.lead.use-case.js";
import { GetAllLeadsUseCase } from "../modules/lead/use-cases/get.all.leads.use-case.js";
import { UpdateLeadStatusUseCase } from "../modules/lead/use-cases/update.lead.status.use-case.js";
export const registerLeadDependencies = () => {
    container.register("ILeadRepository", {
        useClass: LeadRepository,
    });
    container.register("ICreateLeadUseCase", {
        useClass: CreateLeadUseCase,
    });
    container.register("IGetAllLeadsUseCase", {
        useClass: GetAllLeadsUseCase,
    });
    container.register("IUpdateLeadStatusUseCase", {
        useClass: UpdateLeadStatusUseCase,
    });
};
//# sourceMappingURL=lead.container.js.map