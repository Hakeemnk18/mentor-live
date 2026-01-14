import subjectRouter from './routes/subject.routes.js'
import type { Application } from 'express';

export default function registerSubjectModule(app:Application){
    app.use("/api/v1/subjects", subjectRouter);
}
