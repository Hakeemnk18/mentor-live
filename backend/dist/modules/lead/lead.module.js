import leadRouter from "./routes/lead.routes.js";
export default function registerLeadModule(app) {
    app.use("/api/v1/leads", leadRouter);
}
//# sourceMappingURL=lead.module.js.map