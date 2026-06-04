import classRouter from './routes/class.routes.js';
export default function registerClassModule(app) {
    app.use("/api/v1/classes", classRouter);
}
//# sourceMappingURL=class.module.js.map