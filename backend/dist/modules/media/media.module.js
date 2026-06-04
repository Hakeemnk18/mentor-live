import mediaRouter from './routes/media.routes.js';
export default function registerMediaModule(app) {
    app.use("/api/v1/media", mediaRouter);
}
//# sourceMappingURL=media.module.js.map