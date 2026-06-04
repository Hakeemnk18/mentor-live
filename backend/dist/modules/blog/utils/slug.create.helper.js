export const generateSlug = (heading) => {
    return heading
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
//# sourceMappingURL=slug.create.helper.js.map