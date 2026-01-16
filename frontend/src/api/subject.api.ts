import type {
  CreateOrUpdateSubjectPayload,
  CreateSubjectPayload,
  EditSubjectNamePayload,
  GetSubjectByIdApiResponse,
  GetSubjectsApiResponse,
  GetSubjectsParams,
  GetSubjectsResult,
  SubjectVariantPayload,
  SyllabusAndClassPayload,
} from "../shared/types/api.types";
import axiosInstance from "./axios.instance";

export const getSubjects = async (
  params: GetSubjectsParams
): Promise<GetSubjectsResult> => {
  const res = await axiosInstance.get<GetSubjectsApiResponse>("/subjects", {
    params,
  });
  console.log("fetch subjects response ", res);
  const apiData = res.data;

  return {
    rows: apiData.data.map((s) => ({
      _id: s.id,
      name: s.name,
      isDeleted: s.isDeleted,
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

// export const addVariantSubject = async()
export const mapVariantsToSyllabusAndClass = (
  variants: SubjectVariantPayload[]
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
