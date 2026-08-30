let cleanup: (() => void) | null = null;

function initNav(): void {
	cleanup?.();
	cleanup = null;

	const targets = [...document.querySelectorAll<HTMLElement>("#about, #projects, #career, #contact")];
	const navEl = document.querySelector<HTMLElement>("header nav");
	const links = document.querySelectorAll<HTMLAnchorElement>('header nav a[href^="#"]');
	if (targets.length === 0 || links.length === 0) return;

	const setActive = (id: string | null) => {
		for (const link of links) {
			if (id && link.getAttribute("href") === `#${id}`) link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		}
	};

	const lastTarget = targets[targets.length - 1]!;

	const updateActive = () => {
		if (navEl && navEl.offsetParent === null) return;

		const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
		if (scrolledToBottom) {
			setActive(lastTarget.id);
			return;
		}

		let mostRecentlyPassedTarget: HTMLElement | null = null;
		for (const target of targets) {
			const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
			if (target.getBoundingClientRect().top - scrollMarginTop <= 1) mostRecentlyPassedTarget = target;
		}
		setActive(mostRecentlyPassedTarget?.id ?? null);
	};

	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			updateActive();
			ticking = false;
		});
	};

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
	updateActive();

	cleanup = () => {
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onScroll);
	};
}

document.addEventListener("astro:page-load", initNav);
