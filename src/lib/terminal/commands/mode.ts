import { fill } from "../../../i18n/terminal";
import { linesResult, textLine } from "../output";
import type { Command } from "../types";
import { usageError } from "./shared";

export const modeCommand: Command = {
	name: "mode",
	describe: (t) => t.descriptions.mode,
	usage: (t) => t.usages.mode,
	run({ args }, { data, t }) {
		const [target] = args;
		if (!target) return usageError(t, t.usages.mode);
		if (target.toLowerCase() !== "preview") {
			return linesResult(textLine(fill(t.mode.unknown, { mode: target }), "warn"));
		}
		return {
			output: [{ kind: "lines", lines: [textLine(t.mode.switching, "mute")] }],
			action: { type: "navigate", href: data.links.preview },
		};
	},
};

export const exitCommand: Command = {
	name: "exit",
	hidden: true,
	describe: (t) => t.descriptions.mode,
	run: (_input, { data, t }) => ({
		output: [{ kind: "lines", lines: [textLine(t.mode.switching, "mute")] }],
		action: { type: "navigate", href: data.links.preview },
	}),
};
