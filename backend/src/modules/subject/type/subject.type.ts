import type { SubjectVariantView } from "../../subject-variant/type/subject.variant.type.js"

export type SubjectDetailsView = {
  subject: {
    id: string;
    name: string;
  };
  variants: SubjectVariantView[];
};