import syllabusRouter from './routes/syllabus.routes.js';
export default function registerSyllabusModule(app) {
    app.use("/api/v1/syllabuses", syllabusRouter);
}
//# sourceMappingURL=syllabus.module.js.map