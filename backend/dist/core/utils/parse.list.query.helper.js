export function parseListQuery(req) {
    return {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search ?? "",
        sortValue: req.query.sort ?? "createdAt",
        classId: req.query.classId,
        syllabusId: req.query.syllabusId,
        subjectId: req.query.subjectId,
        isDeleted: req.query.isDeleted,
    };
}
//# sourceMappingURL=parse.list.query.helper.js.map