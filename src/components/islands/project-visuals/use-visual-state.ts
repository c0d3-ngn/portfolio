import { useInView } from "motion/react";
import { type RefObject, useRef } from "react";
import { useHydratedReducedMotion } from "../use-hydrated-reduced-motion";

interface VisualState<T extends Element> {
	ref: RefObject<T | null>;
	loops: boolean;
	animated: boolean;
}

/**
 * Shared playback state for project illustrations: `loops` is true only while the element is on
 * screen and motion is allowed, so off-screen cards cost nothing; `animated` is false under
 * reduced motion, where each illustration should render its final static frame.
 */
export function useVisualState<T extends Element>(): VisualState<T> {
	const ref = useRef<T>(null);
	const inView = useInView(ref, { margin: "-10% 0px" });
	const reduceMotion = useHydratedReducedMotion();
	return { ref, loops: inView && !reduceMotion, animated: !reduceMotion };
}
