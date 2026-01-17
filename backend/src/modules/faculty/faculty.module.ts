import facultyRouter from './routes/faculty.routes.js'
import type { Application } from 'express';

export default function registerFacultyModule(app:Application){
    app.use("/api/v1/faculties", facultyRouter);
}
