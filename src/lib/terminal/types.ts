import type { TerminalStrings } from "@/i18n/terminal";
import type { Locale } from "@/i18n/ui";

export type Tone = "ink" | "mute" | "accent" | "ok" | "warn";

export interface Segment {
	text: string;
	tone?: Tone;
	href?: string;
	/** When wrapped, the following lines of this line indent to the end of this segment (a label column). */
	hanging?: boolean;
}

export type Line = Segment[];

/** A unit of terminal output: plain lines, or a decorative aside (e.g. a logo) beside the main lines. */
export type Block = { kind: "lines"; lines: Line[] } | { kind: "split"; aside: Line[]; main: Line[] };

export type TerminalAction = { type: "clear" } | { type: "navigate"; href: string } | { type: "matrix" };

export interface CommandResult {
	output: Block[];
	action?: TerminalAction;
}

export interface ParsedInput {
	name: string;
	args: string[];
}

export interface TerminalSocial {
	label: string;
	url: string;
	handle: string;
}

export interface TerminalProject {
	title: string;
	description: string;
	stack: string[];
	tags: string[];
	repo?: string;
	demo?: string;
	featured: boolean;
}

export interface TerminalCareerEntry {
	role: string;
	company: string;
	location?: string;
	period: string;
	description: string;
	stack: string[];
	current: boolean;
}

export interface TerminalData {
	locale: Locale;
	name: string;
	role: string;
	location: string;
	tagline: string;
	email: string;
	yearsOfExperience: number;
	stack: string[];
	socials: TerminalSocial[];
	about: string;
	projects: TerminalProject[];
	career: TerminalCareerEntry[];
	links: {
		preview: string;
		alternate: string;
		alternateLocale: Locale;
	};
}

export interface CommandContext {
	data: TerminalData;
	t: TerminalStrings;
	history: string[];
	visibleCommands: Command[];
	random: () => number;
	now: () => Date;
}

export interface Command {
	name: string;
	aliases?: string[];
	hidden?: boolean;
	describe(t: TerminalStrings): string;
	usage?(t: TerminalStrings): string;
	run(input: ParsedInput, context: CommandContext): CommandResult;
}
