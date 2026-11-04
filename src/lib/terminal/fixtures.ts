import { terminalStrings } from "../../i18n/terminal";
import type { Locale } from "../../i18n/ui";
import type { Command, CommandContext, TerminalData } from "./types";

export function makeData(locale: Locale = "en"): TerminalData {
	return {
		locale,
		name: "Ada Lovelace",
		role: "Engineer",
		location: "London, UK",
		tagline: "Builds engines.",
		email: "ada@example.com",
		yearsOfExperience: 5,
		stack: ["Python", "Docker"],
		socials: [{ label: "GitHub", url: "https://github.com/ada", handle: "@ada" }],
		about: "First paragraph.\n\nSecond paragraph.",
		projects: [
			{
				title: "Analytical Engine",
				description: "A mechanical computer.",
				stack: ["Brass", "Python"],
				tags: ["hardware", "python"],
				repo: "https://github.com/ada/engine",
				featured: true,
			},
			{
				title: "Notes",
				description: "Annotations on a paper.",
				stack: ["Docker"],
				tags: ["writing"],
				demo: "https://example.com/notes",
				featured: false,
			},
		],
		career: [
			{
				role: "Mathematician",
				company: "Babbage & Co",
				location: "London",
				period: "1842 — Present",
				description: "Worked on algorithms.",
				stack: ["Math"],
				current: true,
			},
			{
				role: "Student",
				company: "Home",
				period: "1830",
				description: "Studied mathematics.",
				stack: [],
				current: false,
			},
		],
		links: {
			preview: locale === "es" ? "/es/" : "/",
			alternate: locale === "es" ? "/dev" : "/es/dev",
			alternateLocale: locale === "es" ? "en" : "es",
		},
	};
}

export function makeContext(
	options: { locale?: Locale; visibleCommands?: Command[]; history?: string[]; random?: () => number } = {},
): CommandContext {
	const locale = options.locale ?? "en";
	return {
		data: makeData(locale),
		t: terminalStrings[locale],
		history: options.history ?? [],
		visibleCommands: options.visibleCommands ?? [],
		random: options.random ?? (() => 0),
		now: () => new Date("2026-11-04T12:00:00Z"),
	};
}
