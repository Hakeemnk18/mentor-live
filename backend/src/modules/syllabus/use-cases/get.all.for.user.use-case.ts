import { inject, injectable } from "tsyringe";

import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IGetSyllabusesForUserUseCase } from "./interfaces/get.all.for.user.interface.js";

@injectable()
export class GetSyllabusesForUserUseCase
  implements IGetSyllabusesForUserUseCase
{
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(): Promise<{ id: string; name: string }[]> {
    return this._syllabusRepository.findAllForUser();
  }
}