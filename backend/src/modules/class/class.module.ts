import classRouter from './routes/class.routes.js'
import type { Application } from 'express';

export default function registerClassModule(app:Application){
    app.use("/api/v1/classes", classRouter);
    
}
