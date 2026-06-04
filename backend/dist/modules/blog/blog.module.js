import blogRouter from "./routes/blog.routes.js";
export default function registerBlogModule(app) {
    app.use("/api/v1/blogs", blogRouter);
}
//# sourceMappingURL=blog.module.js.map