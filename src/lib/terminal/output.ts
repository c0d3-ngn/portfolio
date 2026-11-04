import type { Block, CommandResult, Line, Segment, Tone } from "./types";

export function segment(text: string, tone?: Tone, href?: string): Segment {
	return { text, tone, href };
}

/** A padded, accented label whose value wraps underneath itself instead of under the label. */
export function hangingLabel(text: string, width: number): Segment {
	return { text: text.padEnd(width), tone: "accent", hanging: true };
}

/** A line made of one segment. */
export function textLine(text: string, tone?: Tone): Line {
	return [segment(text, tone)];
}

export const BLANK_LINE: Line = [segment("")];

export function linesBlock(...lines: Line[]): Block {
	return { kind: "lines", lines };
}

/** A command result containing a single block of plain lines. */
export function linesResult(...lines: Line[]): CommandResult {
	return { output: [linesBlock(...lines)] };
}

/** Splits multi-line text into one muted-by-default line per newline, keeping blank lines. */
export function paragraphLines(text: string, tone?: Tone): Line[] {
	return text.split("\n").map((line) => textLine(line, tone));
}

export function lineToString(line: Line): string {
	return line.map((part) => part.text).join("");
}

export function blockToString(block: Block): string {
	return block.kind === "lines"
		? block.lines.map(lineToString).join("\n")
		: [...block.aside, ...block.main].map(lineToString).join("\n");
}

export function resultToString(result: CommandResult): string {
	return result.output.map(blockToString).join("\n");
}
