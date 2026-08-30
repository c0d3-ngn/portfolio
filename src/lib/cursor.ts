import { type CursorBlobState, computeCursorBlobTarget, lerpCursorBlobState } from "./cursor-blob";
import { hasPrecisePointer, prefersReducedMotion } from "./motion";

const LERP_FACTOR = 0.2;

let cleanup: (() => void) | null = null;

function initCursor(): void {
	cleanup?.();
	cleanup = null;

	if (!hasPrecisePointer() || prefersReducedMotion()) return;

	const blob = document.createElement("div");
	blob.className = "cursor-blob";
	document.body.appendChild(blob);
	document.body.classList.add("cursor-none-active");

	let mouseX = window.innerWidth / 2;
	let mouseY = window.innerHeight / 2;
	let hovered: HTMLElement | null = null;
	let state: CursorBlobState = { x: mouseX, y: mouseY, width: 16, height: 16, radius: 50 };

	const onMouseMove = (event: MouseEvent) => {
		mouseX = event.clientX;
		mouseY = event.clientY;
	};
	document.addEventListener("mousemove", onMouseMove);

	for (const el of document.querySelectorAll<HTMLElement>("a, button")) {
		el.addEventListener("mouseenter", () => {
			hovered = el;
		});
		el.addEventListener("mouseleave", () => {
			if (hovered === el) hovered = null;
		});
	}

	let frameId: number;
	function step() {
		const hoveredRect = hovered?.getBoundingClientRect() ?? null;
		const target = computeCursorBlobTarget(mouseX, mouseY, hoveredRect);
		state = lerpCursorBlobState(state, target, LERP_FACTOR);

		blob.style.cssText = `transform: translate(${state.x}px, ${state.y}px); width: ${state.width}px; height: ${state.height}px; margin-left: ${-state.width / 2}px; margin-top: ${-state.height / 2}px; border-radius: ${state.radius}px;`;
		blob.classList.toggle("hovering", !!hovered);

		frameId = requestAnimationFrame(step);
	}
	frameId = requestAnimationFrame(step);

	cleanup = () => {
		document.removeEventListener("mousemove", onMouseMove);
		cancelAnimationFrame(frameId);
		blob.remove();
		document.body.classList.remove("cursor-none-active");
	};
}

document.addEventListener("astro:page-load", initCursor);
