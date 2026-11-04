import type { Command } from "./types";

export interface Registry {
	resolve(name: string): Command | undefined;
	visible(): Command[];
	names(): string[];
}

/**
 * Indexes commands by name and alias.
 * @throws if two commands claim the same name or alias.
 */
export function createRegistry(commands: Command[]): Registry {
	const index = new Map<string, Command>();

	for (const command of commands) {
		for (const key of [command.name, ...(command.aliases ?? [])]) {
			if (index.has(key)) throw new Error(`Duplicate terminal command name or alias: "${key}"`);
			index.set(key, command);
		}
	}

	const visible = commands.filter((command) => !command.hidden);

	return {
		resolve: (name) => index.get(name),
		visible: () => visible,
		names: () => visible.flatMap((command) => [command.name, ...(command.aliases ?? [])]),
	};
}
