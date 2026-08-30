export function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasPrecisePointer(): boolean {
	return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
