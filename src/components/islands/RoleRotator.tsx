import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface RoleRotatorProps {
	roles: string[];
	intervalMs?: number;
}

const DEFAULT_INTERVAL_MS = 2800;

/**
 * Cycles through short phrases with a vertical slide. Screen readers get the full list once;
 * the visual rotation is hidden from them. Hydrate with `client:idle`.
 */
export default function RoleRotator({ roles, intervalMs = DEFAULT_INTERVAL_MS }: RoleRotatorProps) {
	const [index, setIndex] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion || roles.length < 2) return;
		const timer = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), intervalMs);
		return () => window.clearInterval(timer);
	}, [reduceMotion, roles.length, intervalMs]);

	return (
		<span className="relative inline-flex h-[1.6em] items-center overflow-hidden align-middle">
			<span className="sr-only">{roles.join(", ")}</span>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={roles[index]}
					aria-hidden="true"
					initial={{ y: "70%", opacity: 0, filter: "blur(4px)" }}
					animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
					exit={{ y: "-70%", opacity: 0, filter: "blur(4px)" }}
					transition={{ type: "spring", stiffness: 260, damping: 26 }}
					className="inline-block whitespace-nowrap"
				>
					{roles[index]}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}
