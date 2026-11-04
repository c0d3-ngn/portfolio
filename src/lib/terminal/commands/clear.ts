import type { Command } from "../types";

export const clearCommand: Command = {
	name: "clear",
	describe: (t) => t.descriptions.clear,
	run: () => ({ output: [], action: { type: "clear" } }),
};
