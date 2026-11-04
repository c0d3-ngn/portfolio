import { hasPrecisePointer, prefersReducedMotion } from "./motion";

let cleanup: (() => void) | null = null;

function initGlowCards(): void {
	cleanup?.();
	cleanup = null;

	const cards = [...document.querySelectorAll<HTMLElement>("[data-glow]")];
	if (cards.length === 0 || !hasPrecisePointer() || prefersReducedMotion()) return;

	const onPointerMove = (event: PointerEvent) => {
		for (const card of cards) {
			const bounds = card.getBoundingClientRect();
			card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
			card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
		}
	};
	document.addEventListener("pointermove", onPointerMove, { passive: true });

	cleanup = () => document.removeEventListener("pointermove", onPointerMove);
}

document.addEventListener("astro:page-load", initGlowCards);
