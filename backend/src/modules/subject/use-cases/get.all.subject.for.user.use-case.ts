import { inject, injectable } from "tsyringe";
import type { IGetAllSubjectForUserUseCase } from "./interfaces/get.all.subject.for.user.use-case.interface.js";
import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";


@injectable()
export class GetAllSubjectForUserUseCase
  implements IGetAllSubjectForUserUseCase
{
    constructor(
        @inject("ISubjectRepository")
        private readonly _subjectRepository: ISubjectRepository
    ) {}
  async execute(): Promise<{ id: string; name: string }[]> {
    
    return this._subjectRepository.findAllForUser();
  }
}