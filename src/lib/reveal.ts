import { prefersReducedMotion } from "./motion";

function initReveal(): void {
	const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
	if (targets.length === 0) return;

	if (prefersReducedMotion()) {
		for (const el of targets) el.classList.add("is-revealed");
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add("is-revealed");
				obs.unobserve(entry.target);
			}
		},
		{ threshold: 0.2 },
	);

	for (const el of targets) observer.observe(el);
}

document.addEventListener("astro:page-load", initReveal);
