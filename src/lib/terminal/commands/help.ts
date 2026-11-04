import { BLANK_LINE, linesResult, segment, textLine } from "../output";
import type { Command } from "../types";

export const helpCommand: Command = {
	name: "help",
	aliases: ["?"],
	describe: (t) => t.descriptions.help,
	run(_input, { t, visibleCommands }) {
		const nameWidth = Math.max(...visibleCommands.map((command) => command.name.length)) + 2;
		const rows = visibleCommands.map((command) => [
			segment(command.name.padEnd(nameWidth), "accent"),
			segment(command.describe(t), "ink"),
			...(command.aliases?.length ? [segment(`  (${t.help.aliases}: ${command.aliases.join(", ")})`, "mute")] : []),
		]);

		return linesResult(
			textLine(t.help.title, "accent"),
			BLANK_LINE,
			...rows,
			BLANK_LINE,
			textLine(t.help.footer, "mute"),
		);
	},
};
