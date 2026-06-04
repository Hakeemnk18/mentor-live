export function buildFacultySort(sortValue) {
    switch (sortValue) {
        case "price_asc":
            return { price: 1, createdAt: -1 };
        case "price_desc":
            return { price: -1, createdAt: -1 };
        default:
            return { createdAt: -1 };
    }
}
//# sourceMappingURL=faculty-sort.util.js.map