import axiosInstance from "./axios.instance";

export const sendOtp = async (payload: { phoneNumber: string }) => {
  try {
    const res = await axiosInstance.post("/auth/send-otp", payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw err;
  }
};

export const resendOtp = async (payload: { phoneNumber: string }) => {
  try {
    const res = await axiosInstance.post("/auth/resend-otp", payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw err;
  }
};

export const verifyOtp = async (payload: { phoneNumber: string; otp: string }) => {
  try {
    const res = await axiosInstance.post("/auth/verify-otp", payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw err;
  }
};
