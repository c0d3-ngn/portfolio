import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NavLink {
	id: string;
	label: string;
}

interface NavBarProps {
	initials: string;
	homeLabel: string;
	sectionLabel: string;
	links: NavLink[];
	openMenuLabel: string;
	closeMenuLabel: string;
	languageLabel: string;
	alternate: { locale: string; href: string; label: string };
	devHref: string;
	devLabel: string;
	devAriaLabel: string;
}

const SPY_ROOT_MARGIN = "-40% 0px -55% 0px";
const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const menuVariants = {
	hidden: { opacity: 0, transition: { when: "afterChildren", staggerChildren: 0.04, staggerDirection: -1 } },
	visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.05 } },
} as const;

const menuItemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
} as const;

function useScrollSpy(ids: string[]): string | null {
	const [active, setActive] = useState<string | null>(null);
	const key = ids.join("|");

	// biome-ignore lint/correctness/useExhaustiveDependencies: `key` is the stable identity of `ids`
	useEffect(() => {
		const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(entry.target.id);
				}
			},
			{ rootMargin: SPY_ROOT_MARGIN },
		);
		for (const element of elements) observer.observe(element);

		const onScroll = () => {
			if (window.scrollY < window.innerHeight * 0.3) setActive(null);
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", onScroll);
		};
	}, [key]);

	return active;
}

/**
 * Floating pill navigation with a shared-layout active indicator, scroll-spy, language switch
 * and a full-screen menu on small viewports. Hydrate with `client:load`.
 */
export default function NavBar({
	initials,
	homeLabel,
	sectionLabel,
	links,
	openMenuLabel,
	closeMenuLabel,
	languageLabel,
	alternate,
	devHref,
	devLabel,
	devAriaLabel,
}: NavBarProps) {
	const active = useScrollSpy(links.map((link) => link.id));
	const [menuOpen, setMenuOpen] = useState(false);
	const menuId = useId();
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!menuOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMenuOpen(false);
				toggleButtonRef.current?.focus();
				return;
			}
			if (event.key !== "Tab") return;

			const focusable = menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
			const first = focusable?.[0];
			const last = focusable?.[focusable.length - 1];
			if (!first || !last) return;
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [menuOpen]);

	return (
		<MotionConfig reducedMotion="user">
			<header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
				<motion.div
					initial={{ y: -32, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
					className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-2 rounded-full border border-rule bg-ground/70 py-1.5 pr-1.5 pl-2 shadow-[0_8px_32px_-8px_rgb(0_0_0/60%)] backdrop-blur-xl sm:w-auto sm:max-w-none"
				>
					<a
						href="#main"
						aria-label={homeLabel}
						className="inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-mono text-sm text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
					>
						{initials}
					</a>

					<nav aria-label={sectionLabel} className="hidden items-center sm:flex">
						<LayoutGroup id="nav">
							{links.map((link) => {
								const isActive = active === link.id;
								return (
									<a
										key={link.id}
										href={`#${link.id}`}
										aria-current={isActive ? "location" : undefined}
										className={cn(
											"relative inline-flex h-11 items-center rounded-full px-4 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent",
											isActive ? "text-ink" : "text-ink-mute hover:text-ink",
										)}
									>
										{isActive && (
											<motion.span
												layoutId="nav-indicator"
												transition={SPRING}
												className="absolute inset-0 rounded-full bg-surface ring-1 ring-rule"
											>
												<span className="absolute -top-px left-1/2 h-px w-8 -translate-x-1/2 bg-accent" />
												<span className="absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-accent/30 blur-md" />
											</motion.span>
										)}
										<span className="relative">{link.label}</span>
									</a>
								);
							})}
						</LayoutGroup>
					</nav>

					<div className="flex items-center">
						<a
							href={active ? `${alternate.href}#${active}` : alternate.href}
							hrefLang={alternate.locale}
							lang={alternate.locale}
							aria-label={`${alternate.locale.toUpperCase()} — ${languageLabel}: ${alternate.label}`}
							className="inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-mono text-xs tracking-wider text-ink-mute uppercase transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
						>
							{alternate.locale.toUpperCase()}
						</a>
						<a
							href={devHref}
							aria-label={devAriaLabel}
							className="hidden h-11 items-center gap-1.5 rounded-full border border-rule px-4 font-mono text-sm text-ink-mute transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent sm:inline-flex"
						>
							{devLabel}
							<ArrowRight aria-hidden="true" size={14} />
						</a>
						<button
							ref={toggleButtonRef}
							type="button"
							aria-expanded={menuOpen}
							aria-controls={menuId}
							aria-label={openMenuLabel}
							onClick={() => setMenuOpen(true)}
							className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent sm:hidden"
						>
							<Menu aria-hidden="true" size={20} />
						</button>
					</div>
				</motion.div>
			</header>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						ref={menuRef}
						id={menuId}
						role="dialog"
						aria-modal="true"
						aria-label={sectionLabel}
						variants={menuVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="fixed inset-0 z-50 flex flex-col bg-ground/95 px-6 pt-6 pb-10 backdrop-blur-xl sm:hidden"
					>
						<div className="flex justify-end">
							<button
								ref={closeButtonRef}
								type="button"
								aria-label={closeMenuLabel}
								onClick={() => setMenuOpen(false)}
								className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink focus-visible:outline-2 focus-visible:outline-accent"
							>
								<X aria-hidden="true" size={20} />
							</button>
						</div>

						<nav aria-label={sectionLabel} className="mt-10 flex flex-1 flex-col justify-center gap-2">
							{links.map((link, index) => (
								<motion.a
									key={link.id}
									variants={menuItemVariants}
									href={`#${link.id}`}
									onClick={() => setMenuOpen(false)}
									className="flex items-baseline gap-4 border-b border-rule py-4 font-display text-h1 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
								>
									<span className="font-mono text-sm text-ink-mute">{String(index + 1).padStart(2, "0")}</span>
									{link.label}
								</motion.a>
							))}
						</nav>

						<motion.a
							variants={menuItemVariants}
							href={devHref}
							aria-label={devAriaLabel}
							className="inline-flex h-11 items-center gap-2 self-start font-mono text-sm text-ink-mute hover:text-accent"
						>
							{devLabel}
							<ArrowRight aria-hidden="true" size={14} />
						</motion.a>
					</motion.div>
				)}
			</AnimatePresence>
		</MotionConfig>
	);
}
