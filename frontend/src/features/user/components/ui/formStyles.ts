/** Shared input styling used inside the user-side modals */
export const fieldCls = (err?: string | boolean) =>
  `w-full h-[52px] rounded-2xl border-2 px-4 text-base text-ml-ink outline-none transition-colors placeholder:text-[#A39CB5] disabled:bg-ml-mist disabled:text-ml-muted ${
    err ? "border-ml-coral bg-ml-rose/40" : "border-ml-line focus:border-ml-violet"
  }`;

export const labelCls = "text-xs font-extrabold tracking-[0.12em] text-ml-ink uppercase";

export const errorTextCls = "m-0 text-[13px] font-bold text-ml-red";
