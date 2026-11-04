import type { ParsedInput } from "./types";

export const MAX_INPUT_LENGTH = 200;

const QUOTES = new Set(['"', "'"]);

function tokenize(raw: string): string[] {
	const tokens: string[] = [];
	let current = "";
	let quote: string | null = null;
	let hasToken = false;

	for (const char of raw) {
		if (quote) {
			if (char === quote) quote = null;
			else current += char;
		} else if (QUOTES.has(char)) {
			quote = char;
			hasToken = true;
		} else if (/\s/.test(char)) {
			if (hasToken || current) tokens.push(current);
			current = "";
			hasToken = false;
		} else {
			current += char;
			hasToken = true;
		}
	}
	if (hasToken || current) tokens.push(current);
	return tokens;
}

/**
 * Splits a command line into a lowercase command name and its raw arguments. Honors single and
 * double quotes, tolerates unbalanced quotes, and truncates input to {@link MAX_INPUT_LENGTH}.
 */
export function parseInput(raw: string): ParsedInput {
	const [name = "", ...args] = tokenize(raw.slice(0, MAX_INPUT_LENGTH));
	return { name: name.toLowerCase(), args };
}

function isFlag(token: string): boolean {
	return token.startsWith("-") && token.length > 1 && !/^-\d/.test(token);
}

/** True when any of the given flag spellings (e.g. `--featured`, `-f`) is present. */
export function hasFlag(args: string[], ...spellings: string[]): boolean {
	return args.some((arg) => spellings.includes(arg) || spellings.some((spelling) => arg.startsWith(`${spelling}=`)));
}

/** Value of a flag written as `--tag x` or `--tag=x`; `undefined` when absent or valueless. */
export function getFlagValue(args: string[], ...spellings: string[]): string | undefined {
	for (let index = 0; index < args.length; index++) {
		const arg = args[index] ?? "";
		for (const spelling of spellings) {
			if (arg.startsWith(`${spelling}=`)) return arg.slice(spelling.length + 1) || undefined;
			if (arg === spelling) {
				const next = args[index + 1];
				return next !== undefined && !isFlag(next) ? next : undefined;
			}
		}
	}
	return undefined;
}

/** Arguments that are neither flags nor the values of the given value-taking flags. */
export function getPositionals(args: string[], valueFlags: string[] = []): string[] {
	const positionals: string[] = [];
	for (let index = 0; index < args.length; index++) {
		const arg = args[index] ?? "";
		if (valueFlags.includes(arg)) {
			index++;
			continue;
		}
		if (!isFlag(arg)) positionals.push(arg);
	}
	return positionals;
}

/** The first flag not in `known` (compared without any `=value` suffix), or `undefined` when all are known. */
export function findUnknownFlag(args: string[], known: string[]): string | undefined {
	return args.filter(isFlag).find((arg) => !known.includes(arg.split("=")[0] ?? arg));
}
