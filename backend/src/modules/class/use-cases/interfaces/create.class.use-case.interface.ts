import type { CreateClassRequestDto } from "../../dtos/class.create.dto.js";

export interface ICreateClassUseCase {
    execute(dto: CreateClassRequestDto ) : Promise<void>
}