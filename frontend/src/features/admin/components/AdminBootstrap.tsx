import { Navigate, useLocation } from "react-router-dom";
import type { AuthUser } from "../../auth/type/auth.type";
import { useQueryClient } from "@tanstack/react-query";

const ALLOWED_ROLES = ["admin", "salesPerson"] as const;
const SALES_PERSON_ALLOWED = "/admin/bookings";

const AdminBootstrap = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<AuthUser>(["auth-user"]);
  const { pathname } = useLocation();

  if (!user || !ALLOWED_ROLES.includes(user.role as any)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role === "salesPerson" && !pathname.startsWith(SALES_PERSON_ALLOWED)) {
    return <Navigate to={SALES_PERSON_ALLOWED} replace />;
  }

  return <>{children}</>;
};

export default AdminBootstrap;
