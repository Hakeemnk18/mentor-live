import axiosInstance from "./axios.instance";

import type { GetSubjectsParams, GetSubjectsApiResponse, GetSubjectsResult, GetSubjectByIdApiResponse, SyllabusAndClassPayload, CreateSubjectPayload, EditSubjectNamePayload, SubjectForUser, GetSubjectsForUserParams } from "../shared/types/subject.types";
export const getSubjects = async (
  params: GetSubjectsParams
): Promise<GetSubjectsResult> => {
  const res = await axiosInstance.get<GetSubjectsApiResponse>("/subjects", {
    params,
  });
  
  const apiData = res.data;

  return {
    rows: apiData.data.map((s) => ({
      _id: s.id,
      name: s.name,
      isDeleted: s.isDeleted,
      variants: 0, // count not returned by the list endpoint
    })),
    currentPage: apiData.currentPage,
    totalPages: apiData.totalPages,
    total: apiData.total,
  };
};

export const getSubjectById = async (id: string) => {
  const res = await axiosInstance.get<GetSubjectByIdApiResponse>(
    `/subjects/${id}`
  );

  const apiData = res.data.data;

  return {
    _id: apiData.subject.id,     
    name: apiData.subject.name,  
    variants: apiData.variants.map((v) => ({
      syllabusId: v.syllabus.id, 
      classId: v.class.id,       
    })),
  };
};
export const createSubject = async (
  payload: CreateSubjectPayload
) => {
  const res = await axiosInstance.post("/subjects", payload);
  return res.data;
};




export const updateSubject = async (
  id: string,
  payload: EditSubjectNamePayload
) => {
  const res = await axiosInstance.put(`/subjects/${id}`, payload);
  return res.data;
};

export const addSubjectVariants = async (
  id: string,
  variants: { classId: string; syllabusId: string }[]
) => {
  const res = await axiosInstance.post(`/subjects/${id}`, { variants });
  return res.data;
};
export const mapVariantsToSyllabusAndClass = (
  variants: { syllabusId: string; classId: string }[]
): SyllabusAndClassPayload[] => {
  const map = new Map<string, Set<string>>();

  variants.forEach(({ syllabusId, classId }) => {
    if (!map.has(syllabusId)) {
      map.set(syllabusId, new Set());
    }
    map.get(syllabusId)!.add(classId);
  });

  return Array.from(map.entries()).map(([syllabus, classes]) => ({
    syllabus,
    classes: Array.from(classes),
  }));
};

/**
 * Fetch subjects for the user-facing filter pills, optionally scoped to a syllabus + class.
 * Returns the real Subject id (usable directly as a chapter `subjectId` filter).
 * When no filters are passed, returns all subjects.
 */
export const getSubjectsForUser = async (
  params: GetSubjectsForUserParams = {}
): Promise<SubjectForUser[]> => {
  const res = await axiosInstance.get("/subjects/list", { params });
  return res.data.data ?? [];
};
