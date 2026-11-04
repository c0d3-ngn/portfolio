export const MAX_HISTORY = 50;

/** Appends a submitted line, ignoring blanks and immediate repeats, and keeping the newest {@link MAX_HISTORY}. */
export function pushHistory(entries: string[], input: string): string[] {
	const trimmed = input.trim();
	if (!trimmed || entries[entries.length - 1] === trimmed) return entries;
	return [...entries, trimmed].slice(-MAX_HISTORY);
}

export interface HistoryStep {
	cursor: number | null;
	value: string | null;
}

/**
 * Moves through history like a shell. `cursor` is `null` while the user is on their own draft.
 * `value` is the line to show, or `null` to restore the draft.
 */
export function navigateHistory(entries: string[], cursor: number | null, direction: "up" | "down"): HistoryStep {
	if (entries.length === 0) return { cursor, value: null };

	if (direction === "up") {
		const next = cursor === null ? entries.length - 1 : Math.max(0, cursor - 1);
		return { cursor: next, value: entries[next] ?? null };
	}

	if (cursor === null) return { cursor: null, value: null };
	if (cursor >= entries.length - 1) return { cursor: null, value: null };
	const next = cursor + 1;
	return { cursor: next, value: entries[next] ?? null };
}
