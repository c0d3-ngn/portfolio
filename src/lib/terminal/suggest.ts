const MAX_SUGGESTION_DISTANCE = 2;

/** Levenshtein edit distance between two strings. */
export function editDistance(a: string, b: string): number {
	let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

	for (let row = 1; row <= a.length; row++) {
		const current = [row];
		for (let column = 1; column <= b.length; column++) {
			const substitution = (previous[column - 1] ?? 0) + (a[row - 1] === b[column - 1] ? 0 : 1);
			current[column] = Math.min((previous[column] ?? 0) + 1, (current[column - 1] ?? 0) + 1, substitution);
		}
		previous = current;
	}
	return previous[b.length] ?? 0;
}

/** The closest known name within a small edit distance, for "did you mean" hints. */
export function suggest(input: string, names: string[]): string | undefined {
	let best: { name: string; distance: number } | undefined;

	for (const name of names) {
		if (name.length < 3) continue;
		const distance = editDistance(input, name);
		if (distance > 0 && distance <= MAX_SUGGESTION_DISTANCE && (!best || distance < best.distance)) {
			best = { name, distance };
		}
	}
	return best?.name;
}
