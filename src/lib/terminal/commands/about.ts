import { linesResult, paragraphLines } from "../output";
import type { Command } from "../types";

export const aboutCommand: Command = {
	name: "about",
	describe: (t) => t.descriptions.about,
	run: (_input, { data }) => linesResult(...paragraphLines(data.about, "ink")),
};
