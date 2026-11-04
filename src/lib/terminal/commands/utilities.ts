import { BLANK_LINE, linesResult, segment, textLine } from "../output";
import type { Command } from "../types";
import { infoMessage } from "./shared";

export const historyCommand: Command = {
	name: "history",
	describe: (t) => t.descriptions.history,
	run(_input, { history, t }) {
		if (history.length === 0) return infoMessage(t.history.empty);
		return linesResult(
			...history.map((entry, index) => [segment(`${String(index + 1).padStart(3)}  `, "mute"), segment(entry, "ink")]),
		);
	},
};

export const echoCommand: Command = {
	name: "echo",
	describe: (t) => t.descriptions.echo,
	usage: (t) => t.usages.echo,
	run: ({ args }) => linesResult(args.length ? textLine(args.join(" "), "ink") : BLANK_LINE),
};

export const dateCommand: Command = {
	name: "date",
	describe: (t) => t.descriptions.date,
	run: (_input, { data, now }) =>
		linesResult(
			textLine(new Intl.DateTimeFormat(data.locale, { dateStyle: "full", timeStyle: "medium" }).format(now()), "ink"),
		),
};
