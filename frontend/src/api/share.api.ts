import axiosInstance from "./axios.instance";

/** Public summary of a pool slot (tutor, subject, time, seat count — no student details). */
export type PoolShareSummary = {
  slotId: string;
  facultyId: string;
  facultyName: string;
  facultyImage: string;
  variantId: string;
  subjectName: string;
  classId: string;
  className: string;
  syllabusId: string;
  syllabusName: string;
  time: string;
  poolCount: number;
  poolLimit: number;
  isAvailable: boolean;
  isFull: boolean;
};

export const getPoolShareSummary = async (slotId: string): Promise<PoolShareSummary> => {
  const res = await axiosInstance.get(`/share/pool/${encodeURIComponent(slotId)}`);
  return res.data.data;
};
