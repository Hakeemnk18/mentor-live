import { useMutation } from "@tanstack/react-query";
import { logoutUserApi } from "../api/auth.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";



import type { ApiResponse } from "../../../shared/types/common.types";
export const useLogout = () => {
  
  return useMutation<ApiResponse, Error>({
    mutationFn: logoutUserApi,
    onError:(error)=>{
        handleApiError(error)
    },
    retry: false,
  });
};