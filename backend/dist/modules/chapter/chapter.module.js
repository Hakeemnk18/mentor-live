import chapterRouter from './routes/chapter.routes.js';
export default function registerChapterModule(app) {
    app.use("/api/v1/chapters", chapterRouter);
}
//# sourceMappingURL=chapter.module.js.map