import userRoutes from "./UserRoute";
import App from "../App";
import UserLayout from "../shared/layouts/UserLayoutes";
import adminRoutes from "./AdminRoute";
import AdminLayout from "../shared/layouts/AdminLayoutes";
import NotFoundPage from "../shared/pages/NotFoundPage";
import UserNotFoundPage from "../features/user/pages/UserNotFoundPage";


const allRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <UserLayout />,
        children: [
          ...userRoutes,
          { path: "*", element: <UserNotFoundPage /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          ...adminRoutes,
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export default allRoutes;
