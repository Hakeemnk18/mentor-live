export function parseChapterQuery(req) {
    return {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search ?? "",
        sortValue: req.query.sort ?? "createdAt",
        chapterId: req.query.chapterId,
    };
}
//# sourceMappingURL=parse.chapter.request.qury.js.map