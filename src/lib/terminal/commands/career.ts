import { BLANK_LINE, linesResult, paragraphLines, segment, textLine } from "../output";
import { findUnknownFlag, hasFlag } from "../parser";
import type { Command, Line, TerminalCareerEntry } from "../types";
import { infoMessage, usageError } from "./shared";

function entryLines(entry: TerminalCareerEntry, nowLabel: string): Line[] {
	return [
		[
			segment(entry.period, "mute"),
			segment("  "),
			segment(entry.role, "accent"),
			...(entry.current ? [segment(`  ● ${nowLabel}`, "ok")] : []),
		],
		[segment(`${entry.company}${entry.location ? ` — ${entry.location}` : ""}`, "ink")],
		...paragraphLines(entry.description, "mute"),
		...(entry.stack.length ? [[segment(entry.stack.join(" · "), "mute")]] : []),
	];
}

export const careerCommand: Command = {
	name: "career",
	aliases: ["experience"],
	describe: (t) => t.descriptions.career,
	usage: (t) => t.usages.career,
	run({ args }, { data, t }) {
		if (findUnknownFlag(args, ["--current"]) || args.some((arg) => !arg.startsWith("-"))) {
			return usageError(t, t.usages.career);
		}

		const entries = hasFlag(args, "--current") ? data.career.filter((entry) => entry.current) : data.career;
		if (entries.length === 0) return infoMessage(t.career.none);

		const body = entries.flatMap((entry, index) => [
			...(index > 0 ? [BLANK_LINE] : []),
			...entryLines(entry, t.career.now),
		]);
		return linesResult(textLine(t.career.header, "accent"), BLANK_LINE, ...body);
	},
};
