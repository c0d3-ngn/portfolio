import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { sortCareer, sortProjects } from "./sort";

export async function getProjects(): Promise<CollectionEntry<"projects">[]> {
	return sortProjects(await getCollection("projects"));
}

export async function getCareer(): Promise<CollectionEntry<"career">[]> {
	return sortCareer(await getCollection("career"));
}

/** @throws if `src/content/about/index.md` is missing. */
export async function getAbout(): Promise<CollectionEntry<"about">> {
	const entry = await getEntry("about", "index");
	if (!entry) throw new Error("Missing required content entry: src/content/about/index.md");
	return entry;
}
