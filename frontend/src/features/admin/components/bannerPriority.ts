import type { SelectOption } from "./ui";

/** Banner priority slots 1–5 as AdminSelect options (1 = highest). */
export const priorityOptions = (slots: number[]): SelectOption<number>[] =>
  slots.map((p) => ({
    value: p,
    label: String(p),
    hint: p === 1 ? "highest" : p === 5 ? "lowest" : undefined,
  }));
