import type { ProjectData } from "@/types/content";

/** Formats a career date range, e.g. "2024 — Present" or "2021 — 2023". */
export function formatCareerPeriod(start: Date, end?: Date): string {
	const startYear = start.getUTCFullYear();
	if (!end) return `${startYear} — Present`;

	const endYear = end.getUTCFullYear();
	return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
}

/** Deduplicated, alphabetically sorted tags across all given entries. */
export function collectTags<T extends { data: Pick<ProjectData, "tags"> }>(entries: T[]): string[] {
	const unique = new Set<string>();
	for (const entry of entries) {
		for (const tag of entry.data.tags) unique.add(tag);
	}
	return [...unique].sort();
}
