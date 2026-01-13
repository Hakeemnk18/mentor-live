import { inject, injectable } from "tsyringe";
import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { IGetClassesForUserUseCase } from "./interfaces/get.all.for.user.use-case.interface.js";

@injectable()
export class GetClassesForUserUseCase
  implements IGetClassesForUserUseCase
{
  constructor(
    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository
  ) {}

  async execute(): Promise<{ id: string; name: string }[]> {
    return this._classRepository.findAllForUser();
  }
}