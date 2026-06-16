import toast from "react-hot-toast";


type ApiError = {
  response?: { data?: { message?: string; errors?: Record<string, string> } };
  message?: string;
};

export function handleApiError(error: unknown) {
  const e = error as ApiError;
  const message =
    e?.response?.data?.message ||
    e?.message ||
    "Something went wrong";

  const validationErrors = e?.response?.data?.errors;

  toast.error(message);

  
  if (validationErrors && typeof validationErrors === "object") {
    return validationErrors;
  }

  return null;
}
