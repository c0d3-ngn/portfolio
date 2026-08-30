export interface Vector {
	x: number;
	y: number;
}

/** Displacement to push a point away from a source within `radius`, falling off linearly to 0. */
export function repelDisplacement(dx: number, dy: number, radius: number, strength: number): Vector {
	const dist = Math.hypot(dx, dy);
	if (dist === 0 || dist >= radius) return { x: 0, y: 0 };
	const force = (1 - dist / radius) * strength;
	return { x: (dx / dist) * force, y: (dy / dist) * force };
}
