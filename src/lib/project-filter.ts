export const ALL_FILTER = "all";

/** Entries whose keys include `filter`; the "all" sentinel keeps everything. */
export function filterByKey<T>(entries: T[], filter: string, getKeys: (entry: T) => string[]): T[] {
	if (filter === ALL_FILTER) return entries;
	return entries.filter((entry) => getKeys(entry).includes(filter));
}

/** Keys present in at least `minCount` of the key lists, most frequent first (ties alphabetical). */
export function collectSharedKeys(keyLists: string[][], minCount = 2): string[] {
	const counts = new Map<string, number>();
	for (const keys of keyLists) {
		for (const key of new Set(keys)) counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts]
		.filter(([, count]) => count >= minCount)
		.sort(([keyA, countA], [keyB, countB]) => countB - countA || keyA.localeCompare(keyB))
		.map(([key]) => key);
}
