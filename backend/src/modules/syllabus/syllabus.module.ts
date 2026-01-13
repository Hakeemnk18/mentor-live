import syllabusRouter from './routes/syllabus.routes.js'
import type { Application } from 'express';

export default function registerSyllabusModule(app:Application){
    app.use("/api/v1/syllabuses", syllabusRouter);
    
}
