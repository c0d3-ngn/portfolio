import { buildNeofetch } from "../neofetch";
import type { Command } from "../types";

export const neofetchCommand: Command = {
	name: "neofetch",
	aliases: ["whoami", "info"],
	describe: (t) => t.descriptions.neofetch,
	run: (_input, { data, t }) => ({ output: [buildNeofetch(data, t)] }),
};
