import { getProfile } from "@/data/profile";
import { LOCALES, type Locale } from "@/i18n/ui";
import { getAlternatePath, localizePath } from "@/i18n/utils";
import { getAbout, getCareer, getProjects } from "./content";
import { formatCareerPeriod, yearsOfExperience } from "./format";
import { markdownToPlainText } from "./terminal/markdown";
import type { TerminalData } from "./terminal/types";

interface TerminalDataOptions {
	locale: Locale;
	presentLabel: string;
	pathname: string;
}

/**
 * Collects everything the terminal island needs, already localized and reduced to plain,
 * serializable values.
 */
export async function getTerminalData({ locale, presentLabel, pathname }: TerminalDataOptions): Promise<TerminalData> {
	const profile = getProfile(locale);
	const [about, projects, career] = await Promise.all([getAbout(locale), getProjects(locale), getCareer(locale)]);
	const alternateLocale = LOCALES.find((candidate) => candidate !== locale) ?? locale;

	return {
		locale,
		name: profile.name,
		role: profile.role,
		location: profile.location,
		tagline: profile.tagline,
		email: profile.email,
		yearsOfExperience: yearsOfExperience(
			career.map((entry) => entry.data.start),
			new Date(),
		),
		stack: profile.stackSummary,
		socials: profile.socials,
		about: markdownToPlainText(about.body ?? ""),
		projects: projects.map((project) => ({
			title: project.data.title,
			description: markdownToPlainText(project.body ?? ""),
			stack: project.data.stack,
			tags: project.data.tags,
			repo: project.data.repo,
			demo: project.data.demo,
			featured: project.data.featured,
		})),
		career: career.map((entry) => ({
			role: entry.data.role,
			company: entry.data.company,
			location: entry.data.location,
			period: formatCareerPeriod(entry.data.start, entry.data.end, presentLabel),
			description: markdownToPlainText(entry.body ?? ""),
			stack: entry.data.stack,
			current: !entry.data.end,
		})),
		links: {
			preview: localizePath("/", locale),
			alternate: getAlternatePath(pathname, alternateLocale),
			alternateLocale,
		},
	};
}
