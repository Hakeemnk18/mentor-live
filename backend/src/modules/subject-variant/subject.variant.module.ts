import subjectVariantRouter from './routes/subject.variant.subject.routes.ts.js'
import subjectVariantGlobalRouter from './routes/subject.variant.routes.js'
import type { Application } from 'express';

export default function registerSubjectVariantModule(app:Application){
    app.use("/api/v1/subject-variants", subjectVariantGlobalRouter);
    app.use("/api/v1/subjects/:subjectId", subjectVariantRouter);
    
    
}
