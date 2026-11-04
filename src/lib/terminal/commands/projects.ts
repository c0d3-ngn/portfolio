import { fill, type TerminalStrings } from "../../../i18n/terminal";
import { BLANK_LINE, hangingLabel, linesResult, paragraphLines, segment, textLine } from "../output";
import { findUnknownFlag, getFlagValue, getPositionals, hasFlag } from "../parser";
import type { Command, CommandResult, Line, TerminalData, TerminalProject } from "../types";
import { infoMessage, usageError } from "./shared";

const KNOWN_FLAGS = ["--featured", "-f", "--tag", "--stack"];
const VALUE_FLAGS = ["--tag", "--stack"];

function matchesIgnoringCase(values: string[], wanted: string): boolean {
	return values.some((value) => value.toLowerCase() === wanted.toLowerCase());
}

function findProject(projects: TerminalProject[], query: string): TerminalProject | undefined {
	if (/^\d+$/.test(query)) return projects[Number(query) - 1];
	const lowered = query.toLowerCase();
	return projects.find((project) => project.title.toLowerCase().includes(lowered));
}

function detailLines(project: TerminalProject, t: TerminalStrings): Line[] {
	const label = (text: string) => hangingLabel(`${text}:`, 8);
	return [
		[segment(project.title, "accent"), ...(project.featured ? [segment(`  ★ ${t.projects.featured}`, "warn")] : [])],
		BLANK_LINE,
		...paragraphLines(project.description, "ink"),
		BLANK_LINE,
		[label(t.projects.stack), segment(project.stack.join(", "), "ink")],
		...(project.tags.length ? [[label(t.projects.tags), segment(project.tags.join(", "), "mute")]] : []),
		...(project.repo ? [[label(t.projects.repo), segment(project.repo, "ink", project.repo)]] : []),
		...(project.demo ? [[label(t.projects.demo), segment(project.demo, "ink", project.demo)]] : []),
	];
}

function listLines(projects: { project: TerminalProject; number: number }[]): Line[] {
	return projects.flatMap(({ project, number }) => [
		[
			segment(`${String(number).padStart(2, "0")}  `, "mute"),
			segment(project.title, "ink"),
			...(project.featured ? [segment("  ★", "warn")] : []),
		],
		[segment(`    ${project.stack.join(" · ")}`, "mute")],
	]);
}

function listProjects(args: string[], data: TerminalData, t: TerminalStrings): CommandResult {
	const tag = getFlagValue(args, "--tag");
	const stack = getFlagValue(args, "--stack");
	const featuredOnly = hasFlag(args, "--featured", "-f");

	const numbered = data.projects.map((project, index) => ({ project, number: index + 1 }));
	const matches = numbered.filter(
		({ project }) =>
			(!featuredOnly || project.featured) &&
			(!tag || matchesIgnoringCase(project.tags, tag)) &&
			(!stack || matchesIgnoringCase(project.stack, stack)),
	);

	if (data.projects.length === 0) return infoMessage(t.projects.none);
	if (matches.length === 0)
		return infoMessage(fill(t.projects.noMatch, { query: [tag, stack].filter(Boolean).join(" ") || "--featured" }));

	const isFiltered = matches.length !== data.projects.length;
	const header = isFiltered
		? fill(t.projects.filtered, { n: matches.length, total: data.projects.length })
		: fill(t.projects.header, { n: matches.length });

	return linesResult(
		textLine(header, "accent"),
		BLANK_LINE,
		...listLines(matches),
		BLANK_LINE,
		textLine(t.projects.detailsHint, "mute"),
	);
}

export const projectsCommand: Command = {
	name: "projects",
	describe: (t) => t.descriptions.projects,
	usage: (t) => t.usages.projects,
	run({ args }, { data, t }) {
		if (findUnknownFlag(args, KNOWN_FLAGS)) return usageError(t, t.usages.projects);

		const [query] = getPositionals(args, VALUE_FLAGS);
		if (query === undefined) return listProjects(args, data, t);

		const project = findProject(data.projects, query);
		if (!project) return infoMessage(fill(t.projects.noMatch, { query }));
		return linesResult(...detailLines(project, t));
	},
};
