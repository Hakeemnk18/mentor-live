import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IGetSyllabusesForUserUseCase } from "./interfaces/get.all.for.user.interface.js";
export declare class GetSyllabusesForUserUseCase implements IGetSyllabusesForUserUseCase {
    private readonly _syllabusRepository;
    constructor(_syllabusRepository: ISyllabusRepository);
    execute(): Promise<{
        id: string;
        name: string;
    }[]>;
}
//# sourceMappingURL=get.all.for.user.use-case.d.ts.map