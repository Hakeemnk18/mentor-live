export interface IDeleteSubjectVariantUseCase {
  execute(subjectId: string, variantId: string): Promise<void>;
}