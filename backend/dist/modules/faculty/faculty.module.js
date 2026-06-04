import facultyRouter from './routes/faculty.routes.js';
export default function registerFacultyModule(app) {
    app.use("/api/v1/faculties", facultyRouter);
}
//# sourceMappingURL=faculty.module.js.map