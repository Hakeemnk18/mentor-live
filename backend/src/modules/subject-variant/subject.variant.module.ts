import subjectVariantRouter from './routes/subject.variant.routes.js'
import type { Application } from 'express';

export default function registerSubjectVariantModule(app:Application){
    app.use("/api/v1/subjects/:subjectId", subjectVariantRouter);
    
}
