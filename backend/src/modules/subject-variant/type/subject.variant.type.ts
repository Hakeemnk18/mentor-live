export type SubjectVariantView = {
  id: string;
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
};

export type SubjectVariantWithSubjectView = SubjectVariantView & {
  subject: { id: string; name: string };
};