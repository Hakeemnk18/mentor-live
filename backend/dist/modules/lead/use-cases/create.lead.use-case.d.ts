import type { ICreateLeadUseCase } from "./interfaces/create.lead.use-case.interface.js";
import type { CreateLeadRequestDto } from "../dto/create.lead.dto.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";
export declare class CreateLeadUseCase implements ICreateLeadUseCase {
    private readonly _leadRepository;
    constructor(_leadRepository: ILeadRepository);
    execute(dto: CreateLeadRequestDto): Promise<void>;
}
//# sourceMappingURL=create.lead.use-case.d.ts.map