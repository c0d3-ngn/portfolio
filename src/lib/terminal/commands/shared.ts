import { fill, type TerminalStrings } from "../../../i18n/terminal";
import { linesResult, textLine } from "../output";
import type { CommandResult } from "../types";

export function usageError(t: TerminalStrings, usage: string): CommandResult {
	return linesResult(textLine(fill(t.errors.usage, { usage }), "warn"));
}

export function infoMessage(message: string): CommandResult {
	return linesResult(textLine(message, "mute"));
}
