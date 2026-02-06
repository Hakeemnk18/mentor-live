import studentRouter from './routes/student.routes.js'
import type { Application } from 'express';

export default function registerStudentsModule(app:Application){
    app.use("/api/v1/students", studentRouter);
}
