export type ArgumentCandidates = Record<string, string[]>;

export interface Completion {
	completed: string;
	options: string[];
}

function commonPrefix(values: string[]): string {
	const [first = "", ...rest] = values;
	let prefix = first;
	for (const value of rest) {
		while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
	}
	return prefix;
}

function completeToken(token: string, candidates: string[]): { value: string; options: string[] } {
	const matches = candidates.filter((candidate) => candidate.startsWith(token));
	if (matches.length === 0) return { value: token, options: [] };
	if (matches.length === 1) return { value: `${matches[0]} `, options: [] };
	return { value: commonPrefix(matches), options: matches };
}

/**
 * Tab completion. Completes the command name while it is the only token, and the last token from
 * `argumentCandidates[command]` afterwards. A unique match gains a trailing space; several matches
 * complete to their common prefix and are returned in `options`.
 */
export function complete(
	input: string,
	commandNames: string[],
	argumentCandidates: ArgumentCandidates = {},
): Completion {
	const lead = input.trimStart();
	const parts = lead.split(/\s+/);

	if (parts.length === 1) {
		const { value, options } = completeToken(lead, commandNames);
		return { completed: value, options };
	}

	const command = (parts[0] ?? "").toLowerCase();
	const candidates = argumentCandidates[command];
	if (!candidates) return { completed: input, options: [] };

	const lastToken = parts[parts.length - 1] ?? "";
	const head = lead.slice(0, lead.length - lastToken.length);
	const { value, options } = completeToken(lastToken, candidates);
	return { completed: head + value, options };
}
