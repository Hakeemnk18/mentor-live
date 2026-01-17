import mediaRouter from './routes/media.routes.js'
import type { Application } from 'express';

export default function registerMediaModule(app:Application){
    app.use("/api/v1/media", mediaRouter);
}

