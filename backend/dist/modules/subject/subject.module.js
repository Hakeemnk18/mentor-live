import subjectRouter from './routes/subject.routes.js';
export default function registerSubjectModule(app) {
    app.use("/api/v1/subjects", subjectRouter);
}
//# sourceMappingURL=subject.module.js.map