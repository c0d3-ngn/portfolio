import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { Locale } from "@/i18n/ui";
import { filterByLocale } from "./locale-filter";
import { sortCareer, sortProjects } from "./sort";

export async function getProjects(locale: Locale): Promise<CollectionEntry<"projects">[]> {
	return sortProjects(filterByLocale(await getCollection("projects"), locale));
}

export async function getCareer(locale: Locale): Promise<CollectionEntry<"career">[]> {
	return sortCareer(filterByLocale(await getCollection("career"), locale));
}

/** @throws if `src/content/about/<locale>/index.md` is missing. */
export async function getAbout(locale: Locale): Promise<CollectionEntry<"about">> {
	const entry = await getEntry("about", locale);
	if (!entry) throw new Error(`Missing required content entry: src/content/about/${locale}/index.md`);
	return entry;
}
