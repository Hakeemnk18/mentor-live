import axiosInstance from "./axios.instance";

import type { GetChaptersParams, GetChaptersResult, GetChaptersListParams, ChapterListItem, CreateChapterPayload, SubjectVariantsForChapterApi, GetSubjectVariantsParams } from "../shared/types/chapter.types";
export const getChapters = async (
  params: GetChaptersParams
): Promise<GetChaptersResult> => {
  const res = await axiosInstance.get("/chapters", { params });
console.log("fetching chapters resonse ",res)
  const apiData = res.data;

  return {
    rows: apiData.data.map((c: any) => ({
      _id: c.id,
      name: c.name,
      price: c.price,
      icon: c.icon,
      isDeleted: c.isDeleted,
      className: c.subjectVariant.class.name,
      syllabusName: c.subjectVariant.syllabus.name,
      subjectName: c.subjectVariant.subject.name,
      classId: c.subjectVariant.class._id || c.subjectVariant.class.id,
      syllabusId: c.subjectVariant.syllabus._id || c.subjectVariant.syllabus.id,
      subjectVariantId: c.subjectVariant._id || c.subjectVariant.id,
    })),
    currentPage: apiData.currentPage,
    totalPages: apiData.totalPages,
    total: apiData.total,
  };
};
export const createChapter = async (
  payload: CreateChapterPayload
) => {
  const res = await axiosInstance.post("/chapters", payload);
  return res.data;
};
// api/chapter.api.ts

export const updateChapter = async (
  id: string,
  payload: CreateChapterPayload
) => {
  const res = await axiosInstance.put(`/chapters/${id}`, payload);
  return res.data;
};

export const getSubjectVariants = async (
  params: GetSubjectVariantsParams
): Promise<{ _id: string; subjectName: string }[]> => {
  const res = await axiosInstance.get("/subject-variants/subjects", {
    params,
  });

  const apiData = res.data;

  return apiData.data.map((v: SubjectVariantsForChapterApi) => ({
    _id: v.id,
    subjectName: v.subject.name,
  }));
};

export const getChaptersList = async (
  params: GetChaptersListParams
): Promise<ChapterListItem[]> => {
  const res = await axiosInstance.get("/chapters/list", {
    params,
  });

  const apiData = res.data;

  return apiData.data.map((c: any) => ({
    _id: c.id,
    name: c.name,
    price: c.price,
    icon: c.icon,
  }));
};
