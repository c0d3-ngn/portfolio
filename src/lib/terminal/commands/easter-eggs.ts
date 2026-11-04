import { BLANK_LINE, linesResult, segment, textLine } from "../output";
import type { Command, CommandContext } from "../types";

const SECTIONS = ["about", "projects", "career", "contact"];

function pick<T>(items: T[], random: CommandContext["random"]): T | undefined {
	return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

export const sudoCommand: Command = {
	name: "sudo",
	hidden: true,
	describe: (t) => t.eggs.sudo,
	run: (_input, { t }) => linesResult(textLine(t.eggs.sudo, "warn")),
};

export const matrixCommand: Command = {
	name: "matrix",
	hidden: true,
	describe: (t) => t.eggs.matrix,
	run: (_input, { t }) => ({
		output: [{ kind: "lines", lines: [textLine(t.eggs.matrix, "ok")] }],
		action: { type: "matrix" },
	}),
};

export const coffeeCommand: Command = {
	name: "coffee",
	hidden: true,
	describe: (t) => t.eggs.coffee.join(" "),
	run: (_input, { t }) => linesResult(...t.eggs.coffee.map((line) => textLine(line, "mute"))),
};

export const jokeCommand: Command = {
	name: "joke",
	hidden: true,
	describe: (t) => t.eggs.jokes.join(" "),
	run: (_input, { t, random }) => linesResult(textLine(pick(t.eggs.jokes, random) ?? "", "ink")),
};

export const lsCommand: Command = {
	name: "ls",
	hidden: true,
	describe: (t) => t.eggs.lsHint,
	run: (_input, { t }) =>
		linesResult(
			SECTIONS.flatMap((section) => [segment(`${section}/`, "accent"), segment("  ")]),
			BLANK_LINE,
			textLine(t.eggs.lsHint, "mute"),
		),
};

export const pwdCommand: Command = {
	name: "pwd",
	hidden: true,
	describe: (t) => t.eggs.pwd,
	run: (_input, { t }) => linesResult(textLine(t.eggs.pwd, "ink")),
};

export const rmCommand: Command = {
	name: "rm",
	hidden: true,
	describe: (t) => t.eggs.rm,
	run: (_input, { t }) => linesResult(textLine(t.eggs.rm, "warn")),
};

export const vimCommand: Command = {
	name: "vim",
	aliases: ["vi", "nano"],
	hidden: true,
	describe: (t) => t.eggs.vim,
	run: (_input, { t }) => linesResult(textLine(t.eggs.vim, "mute")),
};
