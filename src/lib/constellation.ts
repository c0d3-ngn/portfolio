import { PROJECT_PREVIEW_MODES, type ProjectPreview } from "@/types/content";
import { prefersReducedMotion } from "./motion";
import { hashString, mulberry32 } from "./prng";
import { runWhileVisible } from "./visibility-loop";

interface Scene {
	render(elapsedMs: number): void;
}

type SceneBuilder = (ctx: CanvasRenderingContext2D, width: number, height: number, rand: () => number) => Scene;

function buildPulse(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): Scene {
	const midBand = h * 0.16;
	const points = Array.from({ length: 10 }, () => {
		const hub = rand() < 0.2;
		const upper = rand() < 0.5;
		const y = upper ? rand() * (h * 0.5 - midBand) : h * 0.5 + midBand + rand() * (h * 0.5 - midBand);
		return {
			x: rand() * w,
			y,
			vx: (rand() - 0.5) * 0.16,
			vy: (rand() - 0.5) * 0.14,
			r: hub ? 3 + rand() * 1.5 : 1.4 + rand() * 0.8,
			hub,
		};
	});
	const linkDistance = w * 0.24;
	const ekg = [
		[0, 0],
		[0.12, 0],
		[0.16, -4],
		[0.2, 0],
		[0.24, 0],
		[0.27, 2],
		[0.3, -22],
		[0.33, 14],
		[0.36, -6],
		[0.4, 0],
		[0.55, 0],
		[0.6, -6],
		[0.66, 0],
		[1, 0],
	].map(([fx, dy]) => ({ x: fx * w, y: h * 0.5 + dy }));

	function pointAt(progress: number) {
		const total = ekg.length - 1;
		const pos = (progress % 1) * total;
		const i = Math.floor(pos);
		const frac = pos - i;
		const a = ekg[i]!;
		const b = ekg[Math.min(i + 1, total)]!;
		return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
	}

	return {
		render(t) {
			ctx.clearRect(0, 0, w, h);
			for (const p of points) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > w) p.vx *= -1;
				if (p.y < 0 || p.y > h) p.vy *= -1;
			}
			for (let i = 0; i < points.length; i++) {
				for (let j = i + 1; j < points.length; j++) {
					const dx = points[i]!.x - points[j]!.x;
					const dy = points[i]!.y - points[j]!.y;
					const dist = Math.hypot(dx, dy);
					if (dist >= linkDistance) continue;
					const tt = 1 - dist / linkDistance;
					ctx.strokeStyle = `rgba(232, 80, 58, ${tt * 0.32})`;
					ctx.lineWidth = 0.75;
					ctx.beginPath();
					ctx.moveTo(points[i]!.x, points[i]!.y);
					ctx.lineTo(points[j]!.x, points[j]!.y);
					ctx.stroke();
				}
			}
			const cycle = (t % 1400) / 1400;
			const beat = Math.max(Math.exp(-(((cycle - 0.08) * 18) ** 2)), Math.exp(-(((cycle - 0.22) * 18) ** 2)) * 0.7);
			for (const p of points) {
				const boost = p.hub ? beat : 0;
				ctx.shadowBlur = (p.hub ? 6 : 3) + boost * 10;
				ctx.shadowColor = "rgba(232, 80, 58, 0.9)";
				ctx.fillStyle = p.hub
					? `rgba(255, ${Math.round(140 + boost * 60)}, ${Math.round(110 + boost * 60)}, 1)`
					: "rgba(232, 80, 58, 0.85)";
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r + (p.hub ? boost * 1.5 : 0), 0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			ctx.strokeStyle = "rgba(232, 80, 58, 0.45)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ekg.forEach((p, i) => {
				if (i === 0) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
			});
			ctx.stroke();

			const head = pointAt(t / 2600);
			ctx.shadowBlur = 12;
			ctx.shadowColor = "rgba(255, 140, 110, 0.95)";
			ctx.fillStyle = "#FF8C6E";
			ctx.beginPath();
			ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
		},
	};
}

function buildBars(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): Scene {
	const columns = 6;
	const colWidth = w / columns;
	const groups = Array.from({ length: columns }, (_, c) => {
		const barHeight = 0.25 + rand() * 0.62;
		const count = 2 + Math.floor(rand() * 3);
		const baseX = colWidth * (c + 0.5);
		const points = Array.from({ length: count }, (_, i) => ({
			x: baseX + (rand() - 0.5) * colWidth * 0.3,
			baseY: h - barHeight * h * ((i + 1) / count),
			phase: rand() * Math.PI * 2,
			r: i === count - 1 ? 3.2 : 1.6,
			top: i === count - 1,
		}));
		return { points, baseX };
	});
	const links = Array.from(
		{ length: columns - 1 },
		(_, c) => [groups[c]!.points.at(-1)!, groups[c + 1]!.points.at(-1)!] as const,
	);

	return {
		render(t) {
			ctx.clearRect(0, 0, w, h);
			const bob = (p: { baseY: number; phase: number }) => p.baseY + Math.sin(t / 900 + p.phase) * 2;

			ctx.strokeStyle = "rgba(232, 80, 58, 0.25)";
			ctx.lineWidth = 1;
			for (const [a, b] of links) {
				ctx.beginPath();
				ctx.moveTo(a.x, bob(a));
				ctx.lineTo(b.x, bob(b));
				ctx.stroke();
			}

			for (const group of groups) {
				ctx.strokeStyle = "rgba(232, 80, 58, 0.3)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(group.baseX, h);
				ctx.lineTo(group.baseX, bob(group.points.at(-1)!));
				ctx.stroke();

				for (const p of group.points) {
					const y = bob(p);
					ctx.shadowBlur = p.top ? 8 : 3;
					ctx.shadowColor = "rgba(232, 80, 58, 0.85)";
					ctx.fillStyle = p.top ? "#FF8C6E" : "rgba(232, 80, 58, 0.8)";
					ctx.beginPath();
					ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
					ctx.fill();
					ctx.shadowBlur = 0;
				}
			}
		},
	};
}

function buildGrid(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): Scene {
	const cols = 6;
	const rows = 3;
	const cellW = w / cols;
	const cellH = h / rows;
	const BLINK_DURATION = 260;
	const nodes: { col: number; row: number; x: number; y: number; blinkPeriod: number; blinkPhase: number }[] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (rand() < 0.25) continue;
			const blinkPeriod = 1800 + rand() * 2600;
			nodes.push({
				col: c,
				row: r,
				x: cellW * (c + 0.5) + (rand() - 0.5) * cellW * 0.2,
				y: cellH * (r + 0.5) + (rand() - 0.5) * cellH * 0.2,
				blinkPeriod,
				blinkPhase: rand() * blinkPeriod,
			});
		}
	}
	function neighbor(n: (typeof nodes)[number], dc: number, dr: number) {
		return nodes.find((m) => m.col === n.col + dc && m.row === n.row + dr);
	}

	return {
		render(t) {
			ctx.clearRect(0, 0, w, h);
			ctx.strokeStyle = "rgba(232, 80, 58, 0.2)";
			ctx.lineWidth = 1;
			for (const n of nodes) {
				for (const [dc, dr] of [
					[1, 0],
					[0, 1],
				] as const) {
					const m = neighbor(n, dc, dr);
					if (!m) continue;
					ctx.beginPath();
					ctx.moveTo(n.x, n.y);
					ctx.lineTo(m.x, m.y);
					ctx.stroke();
				}
			}
			for (const n of nodes) {
				const age = (t + n.blinkPhase) % n.blinkPeriod;
				const boost = age < BLINK_DURATION ? 1 - age / BLINK_DURATION : 0;
				ctx.shadowBlur = 2 + boost * 10;
				ctx.shadowColor = "rgba(232, 80, 58, 0.9)";
				ctx.fillStyle = boost > 0.4 ? "#FF8C6E" : "rgba(232, 80, 58, 0.7)";
				ctx.beginPath();
				ctx.arc(n.x, n.y, 1.8 + boost * 1.4, 0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;
			}
		},
	};
}

function buildRoots(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): Scene {
	const segments: { x1: number; y1: number; x2: number; y2: number; depth: number; phase: number }[] = [];
	function grow(x: number, y: number, angle: number, length: number, depth: number) {
		if (depth > 4 || length < 6) return;
		const endX = x + Math.cos(angle) * length;
		const endY = y + Math.sin(angle) * length;
		segments.push({ x1: x, y1: y, x2: endX, y2: endY, depth, phase: rand() * Math.PI * 2 });
		const branches = depth < 2 ? 2 : rand() < 0.6 ? 2 : 1;
		for (let i = 0; i < branches; i++) {
			const spread = 0.35 + rand() * 0.4;
			const nextAngle = angle + (i === 0 ? -1 : 1) * spread * (0.6 + rand() * 0.6);
			grow(endX, endY, nextAngle, length * (0.68 + rand() * 0.15), depth + 1);
		}
	}
	grow(w * (0.3 + rand() * 0.4), h + 4, -Math.PI / 2 + (rand() - 0.5) * 0.3, h * 0.34, 0);

	return {
		render(t) {
			ctx.clearRect(0, 0, w, h);
			for (const s of segments) {
				const sway = Math.sin(t / 1600 + s.phase) * (s.depth * 0.6);
				const x2 = s.x2 + sway;
				const op = Math.max(0.75 - s.depth * 0.08, 0.25);
				ctx.strokeStyle = `rgba(232, 80, 58, ${op})`;
				ctx.lineWidth = Math.max(2.2 - s.depth * 0.4, 0.75);
				ctx.beginPath();
				ctx.moveTo(s.x1, s.y1);
				ctx.lineTo(x2, s.y2);
				ctx.stroke();

				if (s.depth >= 2) {
					ctx.shadowBlur = 6;
					ctx.shadowColor = "rgba(232, 80, 58, 0.9)";
					ctx.fillStyle = "#FF8C6E";
					ctx.beginPath();
					ctx.arc(x2, s.y2, 2, 0, Math.PI * 2);
					ctx.fill();
					ctx.shadowBlur = 0;
				}
			}
		},
	};
}

const builders: Record<ProjectPreview, SceneBuilder> = {
	pulse: buildPulse,
	bars: buildBars,
	grid: buildGrid,
	roots: buildRoots,
};

function isPreviewMode(value: string | undefined): value is ProjectPreview {
	return !!value && (PROJECT_PREVIEW_MODES as readonly string[]).includes(value);
}

function mountCanvas(canvas: HTMLCanvasElement): (() => void) | undefined {
	const mode = canvas.dataset.mode;
	if (!isPreviewMode(mode)) return;

	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.scale(dpr, dpr);

	const rand = mulberry32(hashString(canvas.dataset.seed ?? ""));
	const scene = builders[mode](ctx, rect.width, rect.height, rand);

	scene.render(0);
	if (prefersReducedMotion()) return;

	return runWhileVisible([canvas], (elapsed) => {
		scene.render(elapsed);
	});
}

let cleanup: (() => void) | null = null;

function initConstellations(): void {
	cleanup?.();
	cleanup = null;

	const stops = [...document.querySelectorAll<HTMLCanvasElement>("canvas[data-seed]")]
		.map(mountCanvas)
		.filter((stop): stop is () => void => typeof stop === "function");

	cleanup = () => {
		for (const stop of stops) stop();
	};
}

document.addEventListener("astro:page-load", initConstellations);
