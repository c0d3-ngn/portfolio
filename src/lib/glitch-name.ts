import { pickGlitchFrame } from "./glitch-text";
import { hasPrecisePointer, prefersReducedMotion } from "./motion";
import { runWhileVisible } from "./visibility-loop";

const DEFAULT_RADIUS = 130;
const IDLE_AFTER_MS = 600;

/** Replaces `el`'s text content with one span per character. `el` must contain only plain text — any child element markup is discarded. */
function splitLetters(el: HTMLElement): HTMLElement[] {
	const text = el.textContent ?? "";
	const radius = el.dataset.glitchRadius ?? String(DEFAULT_RADIUS);
	el.textContent = "";
	return [...text].map((ch) => {
		const span = document.createElement("span");
		span.className = "glitch-letter";
		span.textContent = ch;
		span.dataset.char = ch;
		span.dataset.radius = radius;
		el.appendChild(span);
		return span;
	});
}

let cleanup: (() => void) | null = null;

function initGlitchName(): void {
	cleanup?.();
	cleanup = null;

	const lines = [...document.querySelectorAll<HTMLElement>("[data-glitch-line]")];
	if (lines.length === 0 || !hasPrecisePointer() || prefersReducedMotion()) return;

	const letters = lines.flatMap(splitLetters);

	let mouseX = -9999;
	let mouseY = -9999;
	let lastActivityAt = 0;
	let glitchingLetters = 0;
	const onMouseMove = (event: MouseEvent) => {
		mouseX = event.clientX;
		mouseY = event.clientY;
		lastActivityAt = performance.now();
	};
	const onScroll = () => {
		lastActivityAt = performance.now();
	};
	document.addEventListener("mousemove", onMouseMove);
	window.addEventListener("scroll", onScroll, { passive: true });

	const stop = runWhileVisible(lines, (_elapsed, timestamp) => {
		if (glitchingLetters === 0 && timestamp - lastActivityAt > IDLE_AFTER_MS) return;
		for (const letter of letters) {
			const rect = letter.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dist = Math.hypot(mouseX - cx, mouseY - cy);
			const radius = Number(letter.dataset.radius);

			if (dist < radius) {
				const nextAt = Number(letter.dataset.nextGlitchAt ?? 0);
				if (timestamp > nextAt) {
					const frame = pickGlitchFrame(letter.dataset.char ?? "", Math.random);
					letter.textContent = frame.char;
					letter.classList.toggle("is-glitching", frame.isGlitch);
					letter.dataset.nextGlitchAt = String(timestamp + frame.nextDelayMs);
					if (!letter.dataset.active) glitchingLetters++;
					letter.dataset.active = "1";
				}
			} else if (letter.dataset.active) {
				letter.textContent = letter.dataset.char ?? "";
				letter.classList.remove("is-glitching");
				delete letter.dataset.active;
				glitchingLetters--;
			}
		}
	});

	cleanup = () => {
		document.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("scroll", onScroll);
		stop();
	};
}

document.addEventListener("astro:page-load", initGlitchName);
