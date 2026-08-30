export interface CursorBlobState {
	x: number;
	y: number;
	width: number;
	height: number;
	radius: number;
}

export interface HoveredRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

const IDLE_SIZE = 16;
const IDLE_RADIUS = 50;
const HOVER_PADDING_X = 24;
const HOVER_PADDING_Y = 16;
const HOVER_RADIUS = 8;

export function computeCursorBlobTarget(mouseX: number, mouseY: number, hovered: HoveredRect | null): CursorBlobState {
	if (!hovered) {
		return { x: mouseX, y: mouseY, width: IDLE_SIZE, height: IDLE_SIZE, radius: IDLE_RADIUS };
	}
	return {
		x: hovered.left + hovered.width / 2,
		y: hovered.top + hovered.height / 2,
		width: hovered.width + HOVER_PADDING_X,
		height: hovered.height + HOVER_PADDING_Y,
		radius: HOVER_RADIUS,
	};
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function lerpCursorBlobState(
	current: CursorBlobState,
	target: CursorBlobState,
	factor: number,
): CursorBlobState {
	return {
		x: lerp(current.x, target.x, factor),
		y: lerp(current.y, target.y, factor),
		width: lerp(current.width, target.width, factor),
		height: lerp(current.height, target.height, factor),
		radius: lerp(current.radius, target.radius, factor),
	};
}
