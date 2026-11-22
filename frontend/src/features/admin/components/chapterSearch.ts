import { getChapters } from "../../../api/chapter.api";
import type { AsyncOption } from "./ui";

/** Results per search in the chapter picker (kept short on purpose — type to narrow). */
export const CHAPTER_SEARCH_LIMIT = 8;

/** Server-side chapter search across ALL syllabuses/classes (active chapters only). */
export const searchChapters = async (query: string): Promise<AsyncOption[]> => {
  const res = await getChapters({
    page: 1,
    limit: CHAPTER_SEARCH_LIMIT,
    search: query || undefined,
    isDeleted: false,
  });
  return res.rows.map((c) => ({
    value: c._id,
    label: c.name,
    hint: [c.subjectName, c.className, c.syllabusName].filter(Boolean).join(" · "),
  }));
};
