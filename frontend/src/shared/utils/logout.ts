import { QueryClient } from "@tanstack/react-query";

let queryClientRef: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClientRef = client;
};

export const logout = () => {
  queryClientRef?.removeQueries({ queryKey: ["auth-user"] });
  /* Do NOT call window.location.reload() here.
     AdminBootstrap detects the missing cache entry and navigates
     to /admin/login via React Router <Navigate>.
     Calling reload() on the user-side causes an infinite reload
     loop: 401 → refresh fails → logout() → reload → 401 again. */
};
