export const toMinutes = (iso) => {
    const d = new Date(iso);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
};
export const validateTime = (prev, curr) => {
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
export const validateOnCreate = (slots) => {
    const minutes = slots.map((s) => toMinutes(s.time)).sort((a, b) => a - b);
    for (let i = 0; i < minutes.length; i++) {
        const curr = minutes[i];
        if (curr === undefined)
            continue;
        const prev = i > 0 ? minutes[i - 1] ?? null : null;
        if (!validateTime(prev, curr)) {
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=validate.time.slot.js.map