import { container } from "tsyringe";

import type { ILeadRepository } from "../modules/lead/repository/lead.repository.interface.js";
import { LeadRepository } from "../modules/lead/repository/lead.repository.js";

import type { ICreateLeadUseCase } from "../modules/lead/use-cases/interfaces/create.lead.use-case.interface.js";
import { CreateLeadUseCase } from "../modules/lead/use-cases/create.lead.use-case.js";

import type { IGetAllLeadsUseCase } from "../modules/lead/use-cases/interfaces/get.all.leads.use-case.interface.js";
import { GetAllLeadsUseCase } from "../modules/lead/use-cases/get.all.leads.use-case.js";

import type { IUpdateLeadStatusUseCase } from "../modules/lead/use-cases/interfaces/update.lead.status.use-case.interface.js";
import { UpdateLeadStatusUseCase } from "../modules/lead/use-cases/update.lead.status.use-case.js";

export const registerLeadDependencies = () => {
  container.register<ILeadRepository>("ILeadRepository", {
    useClass: LeadRepository,
  });

  container.register<ICreateLeadUseCase>("ICreateLeadUseCase", {
    useClass: CreateLeadUseCase,
  });

  container.register<IGetAllLeadsUseCase>("IGetAllLeadsUseCase", {
    useClass: GetAllLeadsUseCase,
  });

  container.register<IUpdateLeadStatusUseCase>("IUpdateLeadStatusUseCase", {
    useClass: UpdateLeadStatusUseCase,
  });
};
