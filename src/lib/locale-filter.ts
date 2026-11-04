import type { Locale } from "@/i18n/ui";

/** Content entries live in `<locale>/<slug>`; keeps only those of the given locale. */
export function filterByLocale<T extends { id: string }>(entries: T[], locale: Locale): T[] {
	return entries.filter((entry) => entry.id.startsWith(`${locale}/`));
}
