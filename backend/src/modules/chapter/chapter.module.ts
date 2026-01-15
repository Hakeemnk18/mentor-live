import chapterRouter from './routes/chapter.routes.js'
import type { Application } from 'express';

export default function registerChapterModule(app:Application){
    app.use("/api/v1/chapters", chapterRouter);
}
