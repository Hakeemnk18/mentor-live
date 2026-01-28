import type { RemoveUserFromPoolDto } from "../../dto/remove.student.from.pooling.dto.js";

export interface IRemoveStudentFromPoolingUseCase {
  execute(dto: RemoveUserFromPoolDto): Promise<void>;
}