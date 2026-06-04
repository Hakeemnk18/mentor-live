import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import adminUserRoutes from './routes/admin.user.routes.js';
export default function registerUserModule(app) {
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/admin", adminRoutes);
    app.use("/api/v1/admin/users", adminUserRoutes);
}
//# sourceMappingURL=user.module.js.map