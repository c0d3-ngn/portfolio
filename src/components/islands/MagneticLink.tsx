import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { hasPrecisePointer, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MagneticVariant = "primary" | "outline";

interface MagneticLinkProps {
	href: string;
	label: string;
	variant?: MagneticVariant;
	external?: boolean;
	className?: string;
}

const PULL_STRENGTH = 0.28;
const SPRING = { stiffness: 220, damping: 16, mass: 0.4 } as const;

const variantClasses: Record<MagneticVariant, string> = {
	primary: "bg-accent text-ground hover:shadow-[0_0_40px_-4px_rgb(232_80_58/60%)]",
	outline: "border border-rule bg-surface/40 text-ink hover:border-accent hover:text-accent",
};

/**
 * Pill link that leans toward the pointer. Behaves as a plain link on touch devices and under
 * reduced motion. Hydrate with `client:idle`.
 */
export default function MagneticLink({
	href,
	label,
	variant = "primary",
	external = false,
	className,
}: MagneticLinkProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const smoothX = useSpring(x, SPRING);
	const smoothY = useSpring(y, SPRING);

	const onPointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
		if (!hasPrecisePointer() || prefersReducedMotion()) return;
		const bounds = event.currentTarget.getBoundingClientRect();
		x.set((event.clientX - (bounds.left + bounds.width / 2)) * PULL_STRENGTH);
		y.set((event.clientY - (bounds.top + bounds.height / 2)) * PULL_STRENGTH);
	};

	const onPointerLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.a
			href={href}
			style={{ x: smoothX, y: smoothY }}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			whileTap={{ scale: 0.96 }}
			{...(external && { target: "_blank", rel: "noreferrer noopener" })}
			className={cn(
				"group inline-flex h-12 items-center gap-2 rounded-full px-6 font-mono text-sm transition-[box-shadow,color,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
				variantClasses[variant],
				className,
			)}
		>
			{label}
			<ArrowUpRight
				aria-hidden="true"
				size={16}
				className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
			/>
		</motion.a>
	);
}
