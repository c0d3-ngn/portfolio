import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Like `useReducedMotion`, but reports `false` until after hydration. The server cannot know the
 * preference, so reading it during the first client render would make the markup differ from the
 * server's and trigger a hydration mismatch.
 */
export function useHydratedReducedMotion(): boolean {
	const prefersReduced = useReducedMotion();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => setHydrated(true), []);

	return hydrated && Boolean(prefersReduced);
}
