import subjectVariantRouter from './routes/subject.variant.subject.routes.ts.js';
import subjectVariantGlobalRouter from './routes/subject.variant.routes.js';
export default function registerSubjectVariantModule(app) {
    app.use("/api/v1/subject-variants", subjectVariantGlobalRouter);
    app.use("/api/v1/subjects/:subjectId", subjectVariantRouter);
}
//# sourceMappingURL=subject.variant.module.js.map