import studentRouter from './routes/student.routes.js';
export default function registerStudentsModule(app) {
    app.use("/api/v1/students", studentRouter);
}
//# sourceMappingURL=student.module.js.map