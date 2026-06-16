export type ISlots = {
  time: Date;
};

export const toMinutes = (iso: Date) => {
  const d = new Date(iso);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

export  const validateTime = (prev: number | null, curr: number) => {
  const ONE_HOUR = 60;
  const DAY_END = 24 * 60;

  const currEnd = curr + ONE_HOUR;


  if (currEnd > DAY_END) {
    console.log("slot must end before 24:00");
    return false;
  }

  if (prev !== null && curr < prev + ONE_HOUR) {
    console.log("the time should have a one hour gap");
    return false;
  }

  return true;
};

export  const validateOnCreate = (slots: ISlots[]) => {

  const minutes = slots.map((s) => toMinutes(s.time)).sort((a, b) => a - b);

  for (let i = 0; i < minutes.length; i++) {
    const curr = minutes[i];
    if (curr === undefined) continue;
    const prev = i > 0 ? minutes[i - 1] ?? null : null;

    if (!validateTime(prev, curr)) {
      return false;
    }
  }
  return true;
}

/**
 * Ensures every new slot keeps a 1-hr gap from each other slot already
 * stored for the same faculty + variant.
 */
export const validateAgainstExisting = (
  newSlots: ISlots[],
  existingTimes: Date[],
) => {
  const ONE_HOUR = 60;
  const existingMinutes = existingTimes.map((t) => toMinutes(t));

  for (const slot of newSlots) {
    const curr = toMinutes(slot.time);
    if (existingMinutes.some((m) => Math.abs(m - curr) < ONE_HOUR)) {
      return false;
    }
  }
  return true;
};
