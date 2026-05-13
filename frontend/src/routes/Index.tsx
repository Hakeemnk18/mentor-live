import userRoutes from "./UserRoute";
import App from "../App";
import UserLayout from "../shared/layouts/UserLayoutes";
import adminRoutes from "./AdminRoute";
import AdminLayout from "../shared/layouts/AdminLayoutes";
import NotFoundPage from "../shared/pages/NotFoundPage";
import UserNotFoundPage from "../features/user/pages/UserNotFoundPage";
import UserError from "../shared/components/UserError";
import AdminError from "../shared/components/AdminError";
import AdminBootstrap from "../features/admin/components/AdminBootstrap";

const allRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <UserLayout />,
        errorElement: <UserError />,
        children: [
          ...userRoutes,
          { path: "*", element: <UserNotFoundPage /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        errorElement: <AdminError />,
        children: [
          ...adminRoutes,
          {
            path: "*",
            element: (
              <AdminBootstrap>
                <NotFoundPage />
              </AdminBootstrap>
            ),
          },
        ],
      },
    ],
  },
];

export default allRoutes;
