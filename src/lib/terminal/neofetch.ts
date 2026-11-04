import { fill, type TerminalStrings } from "../../i18n/terminal";
import { BLANK_LINE, hangingLabel, segment } from "./output";
import type { Block, Line, Segment, TerminalData, Tone } from "./types";

const I = [" ___ ", "|_ _|", " | | ", " | | ", "|___|"];
const M = [" __  __ ", "|  \\/  |", "| |\\/| |", "| |  | |", "|_|  |_|"];
const P = [" ____  ", "|  _ \\ ", "| |_) |", "|  __/ ", "|_|    "];

export const LOGO_LINES = I.map((row, index) => `${row}${M[index]}${P[index]}`);

const SWATCH_TONES: Tone[] = ["ink", "mute", "accent", "ok", "warn"];
const SWATCH = "███";

function infoRow(label: string, labelWidth: number, value: Segment[]): Line {
	return [hangingLabel(label, labelWidth), ...value];
}

/**
 * The neofetch screen: an ASCII "IMP" logo beside a profile summary. Every value comes from
 * {@link TerminalData}, so the screen can never drift from the rest of the site.
 */
export function buildNeofetch(data: TerminalData, t: TerminalStrings): Block {
	const user = (data.name.split(" ")[0] ?? data.name).toLowerCase();
	const host = "portfolio";
	const currentRole = data.career.find((entry) => entry.current);

	const rows: { label: string; value: Segment[] }[] = [
		{ label: t.neofetch.role, value: [segment(data.role, "ink")] },
		{ label: t.neofetch.location, value: [segment(data.location, "ink")] },
		{
			label: t.neofetch.experience,
			value: [segment(fill(t.neofetch.years, { n: data.yearsOfExperience }), "ink")],
		},
		...(currentRole
			? [{ label: t.neofetch.company, value: [segment(`${currentRole.role} @ ${currentRole.company}`, "ink")] }]
			: []),
		{ label: t.neofetch.stack, value: [segment(data.stack.join(", "), "ink")] },
		{ label: t.neofetch.email, value: [segment(data.email, "ink", `mailto:${data.email}`)] },
		...data.socials.map((social) => ({
			label: social.label,
			value: [segment(social.handle, "ink", social.url)],
		})),
		{ label: t.neofetch.languages, value: [segment(t.neofetch.languagesValue, "ink")] },
	];

	const labelWidth = Math.max(...rows.map((row) => row.label.length)) + 2;
	const header = `${user}@${host}`;

	const main: Line[] = [
		[segment(user, "accent"), segment("@", "mute"), segment(host, "accent")],
		[segment("─".repeat(header.length), "mute")],
		[segment(data.name, "ink")],
		...rows.map((row) => infoRow(row.label, labelWidth, row.value)),
		BLANK_LINE,
		SWATCH_TONES.flatMap((tone) => [segment(SWATCH, tone), segment(" ")]),
	];

	return {
		kind: "split",
		aside: LOGO_LINES.map((line) => [segment(line, "accent")]),
		main,
	};
}
