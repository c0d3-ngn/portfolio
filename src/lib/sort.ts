import type { CareerData, ProjectData } from "@/types/content";

/** Featured projects first, then ascending by `order`. */
export function compareProjects(a: ProjectData, b: ProjectData): number {
	if (a.featured !== b.featured) return a.featured ? -1 : 1;
	return a.order - b.order;
}

/** Reverse-chronological by end date; the current role sorts first. */
export function compareCareer(a: CareerData, b: CareerData): number {
	const aEnd = a.end?.getTime() ?? Number.POSITIVE_INFINITY;
	const bEnd = b.end?.getTime() ?? Number.POSITIVE_INFINITY;
	if (aEnd !== bEnd) return bEnd - aEnd;
	return b.start.getTime() - a.start.getTime();
}

export function sortProjects<T extends { data: ProjectData }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => compareProjects(a.data, b.data));
}

export function sortCareer<T extends { data: CareerData }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => compareCareer(a.data, b.data));
}
