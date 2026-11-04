import { fill } from "../../i18n/terminal";
import { BLANK_LINE, linesResult, textLine } from "./output";
import { parseInput } from "./parser";
import type { Registry } from "./registry";
import { suggest } from "./suggest";
import type { CommandContext, CommandResult } from "./types";

type RunContext = Omit<CommandContext, "visibleCommands">;

function notFound(name: string, registry: Registry, t: CommandContext["t"]): CommandResult {
	const suggestion = suggest(name, registry.names());
	return linesResult(
		textLine(fill(t.errors.notFound, { name }), "warn"),
		...(suggestion
			? [textLine(fill(t.errors.didYouMean, { name: suggestion }), "mute")]
			: [textLine(t.errors.tryHelp, "mute")]),
		BLANK_LINE,
	);
}

/**
 * Parses and executes one command line. Never throws: empty input yields no output, unknown
 * commands yield a hint, and any command failure becomes a generic error line.
 */
export function runCommand(raw: string, registry: Registry, context: RunContext): CommandResult {
	const input = parseInput(raw);
	if (!input.name) return { output: [] };

	const command = registry.resolve(input.name);
	if (!command) return notFound(input.name, registry, context.t);

	try {
		return command.run(input, { ...context, visibleCommands: registry.visible() });
	} catch {
		return linesResult(textLine(context.t.errors.failed, "warn"));
	}
}
