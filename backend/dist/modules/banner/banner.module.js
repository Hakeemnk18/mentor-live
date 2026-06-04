import bannerRouter from "./routes/banner.routes.js";
export default function registerBannerModule(app) {
    app.use("/api/v1/banners", bannerRouter);
}
//# sourceMappingURL=banner.module.js.map