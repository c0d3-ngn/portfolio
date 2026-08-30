export const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#01";

export interface GlitchFrame {
	char: string;
	isGlitch: boolean;
	nextDelayMs: number;
}

const REVEAL_PROBABILITY = 0.4;
const MIN_DELAY_MS = 45;
const DELAY_RANGE_MS = 70;

/** Rolls `rand()` three times: reveal-vs-glitch, glitch character index, next delay. */
export function pickGlitchFrame(realChar: string, rand: () => number): GlitchFrame {
	const isGlitch = rand() >= REVEAL_PROBABILITY;
	const char = isGlitch ? GLITCH_CHARS[Math.floor(rand() * GLITCH_CHARS.length)]! : realChar;
	const nextDelayMs = MIN_DELAY_MS + rand() * DELAY_RANGE_MS;
	return { char, isGlitch, nextDelayMs };
}
