import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { hasPrecisePointer, prefersReducedMotion } from "@/lib/motion";

const SPOTLIGHT_RADIUS = 460;
const SPRING = { stiffness: 110, damping: 22 } as const;

/**
 * Radial accent glow that trails the pointer across its positioned parent.
 * Renders nothing visible on touch devices or under reduced motion. Hydrate with `client:idle`.
 */
export default function HeroSpotlight() {
	const ref = useRef<HTMLDivElement>(null);
	const x = useMotionValue(-SPOTLIGHT_RADIUS);
	const y = useMotionValue(-SPOTLIGHT_RADIUS);
	const smoothX = useSpring(x, SPRING);
	const smoothY = useSpring(y, SPRING);
	const background = useMotionTemplate`radial-gradient(${SPOTLIGHT_RADIUS}px circle at ${smoothX}px ${smoothY}px, rgb(232 80 58 / 15%), transparent 70%)`;

	useEffect(() => {
		const parent = ref.current?.parentElement;
		if (!parent || !hasPrecisePointer() || prefersReducedMotion()) return;

		const onPointerMove = (event: PointerEvent) => {
			const bounds = parent.getBoundingClientRect();
			x.set(event.clientX - bounds.left);
			y.set(event.clientY - bounds.top);
		};
		parent.addEventListener("pointermove", onPointerMove);
		return () => parent.removeEventListener("pointermove", onPointerMove);
	}, [x, y]);

	return (
		<motion.div ref={ref} aria-hidden="true" style={{ background }} className="pointer-events-none absolute inset-0" />
	);
}
