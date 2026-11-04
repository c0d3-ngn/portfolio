/** Formats a career date range, e.g. "2024 — Present" or "2021 — 2023". */
export function formatCareerPeriod(start: Date, end?: Date, presentLabel = "Present"): string {
	const startYear = start.getUTCFullYear();
	if (!end) return `${startYear} — ${presentLabel}`;

	const endYear = end.getUTCFullYear();
	return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
}

/** Whole calendar years since the earliest start date; 0 when there are none. */
export function yearsOfExperience(startDates: Date[], now: Date): number {
	if (startDates.length === 0) return 0;
	const firstYear = Math.min(...startDates.map((date) => date.getUTCFullYear()));
	return Math.max(0, now.getUTCFullYear() - firstYear);
}
