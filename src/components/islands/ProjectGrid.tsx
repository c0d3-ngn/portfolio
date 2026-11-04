import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useMotionValue, useSpring } from "motion/react";
import { type PointerEvent as ReactPointerEvent, useMemo, useState } from "react";
import { hasPrecisePointer, prefersReducedMotion } from "@/lib/motion";
import { ALL_FILTER, filterByKey } from "@/lib/project-filter";
import { cn } from "@/lib/utils";
import type { ProjectPreview } from "@/types/content";
import ProjectVisual from "./project-visuals/ProjectVisual";

export interface ProjectCardData {
	id: string;
	title: string;
	html: string;
	stack: string[];
	repo?: string;
	demo?: string;
	featured: boolean;
	preview?: ProjectPreview;
	previewLabel?: string;
}

interface ProjectGridProps {
	projects: ProjectCardData[];
	filters: string[];
	labels: {
		filterLabel: string;
		all: string;
		repo: string;
		demo: string;
		featured: string;
	};
}

const MAX_TILT_DEGREES = 5;
const TILT_SPRING = { stiffness: 200, damping: 20, mass: 0.5 } as const;
const CARD_SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

interface ProjectCardProps {
	project: ProjectCardData;
	labels: ProjectGridProps["labels"];
}

function ProjectCard({ project, labels }: ProjectCardProps) {
	const tiltX = useSpring(useMotionValue(0), TILT_SPRING);
	const tiltY = useSpring(useMotionValue(0), TILT_SPRING);

	const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
		if (!hasPrecisePointer() || prefersReducedMotion()) return;
		const card = event.currentTarget;
		const bounds = card.getBoundingClientRect();
		const offsetX = event.clientX - bounds.left;
		const offsetY = event.clientY - bounds.top;
		card.style.setProperty("--mx", `${offsetX}px`);
		card.style.setProperty("--my", `${offsetY}px`);
		tiltY.set((offsetX / bounds.width - 0.5) * 2 * MAX_TILT_DEGREES);
		tiltX.set(-(offsetY / bounds.height - 0.5) * 2 * MAX_TILT_DEGREES);
	};

	const onPointerLeave = () => {
		tiltX.set(0);
		tiltY.set(0);
	};

	return (
		<motion.article
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}
			className={cn("glow-card flex h-full flex-col overflow-hidden", project.featured && "lg:flex-row")}
		>
			{project.preview && (
				<div
					className={cn(
						"relative min-h-56 shrink-0 border-b border-rule",
						project.featured && "lg:w-2/5 lg:border-r lg:border-b-0",
					)}
				>
					<ProjectVisual mode={project.preview} label={project.previewLabel} />
				</div>
			)}

			<div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
				<div>
					{project.featured && (
						<p className="mb-3 font-mono text-[0.6875rem] tracking-widest text-accent uppercase">{labels.featured}</p>
					)}
					<h3 className="font-display text-h2 leading-tight text-ink">{project.title}</h3>
					<div
						className="mt-3 max-w-2xl text-ink-mute [&_p+p]:mt-3"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is rendered from first-party markdown at build time
						dangerouslySetInnerHTML={{ __html: project.html }}
					/>
				</div>

				<ul className="flex flex-wrap gap-2">
					{project.stack.map((tech) => (
						<li
							key={tech}
							className="rounded-full border border-rule bg-ground/60 px-3 py-1 font-mono text-xs text-ink-mute"
						>
							{tech}
						</li>
					))}
				</ul>

				{(project.repo || project.demo) && (
					<div className="mt-auto flex flex-wrap gap-x-6 border-t border-rule pt-2 font-mono text-sm">
						{project.repo && (
							<a
								href={project.repo}
								target="_blank"
								rel="noreferrer noopener"
								className="group/link link-accent inline-flex h-11 items-center gap-1.5 text-ink-mute"
							>
								{labels.repo}
								<ArrowUpRight
									aria-hidden="true"
									size={14}
									className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
								/>
							</a>
						)}
						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noreferrer noopener"
								className="group/link link-accent inline-flex h-11 items-center gap-1.5 text-ink-mute"
							>
								{labels.demo}
								<ArrowUpRight
									aria-hidden="true"
									size={14}
									className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
								/>
							</a>
						)}
					</div>
				)}
			</div>
		</motion.article>
	);
}

/**
 * Tag-filterable project grid with an animated active-filter indicator, layout transitions between
 * filter states, and spotlight/tilt cards. Hydrate with `client:visible`.
 */
export default function ProjectGrid({ projects, filters: filterKeys, labels }: ProjectGridProps) {
	const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
	const visibleProjects = useMemo(
		() => filterByKey(projects, activeFilter, (project) => project.stack),
		[projects, activeFilter],
	);
	const filterOptions = [
		{ value: ALL_FILTER, label: labels.all },
		...filterKeys.map((key) => ({ value: key, label: key })),
	];

	return (
		<MotionConfig reducedMotion="user">
			{filterKeys.length > 0 && (
				<LayoutGroup id="project-filters">
					<fieldset className="flex flex-wrap gap-2">
						<legend className="sr-only">{labels.filterLabel}</legend>
						{filterOptions.map((filter) => {
							const isActive = activeFilter === filter.value;
							return (
								<button
									key={filter.value}
									type="button"
									aria-pressed={isActive}
									onClick={() => setActiveFilter(filter.value)}
									className={cn(
										"relative inline-flex h-11 items-center rounded-full px-5 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
										isActive ? "text-ground" : "text-ink-mute hover:text-ink",
									)}
								>
									{isActive && (
										<motion.span
											layoutId="project-filter-indicator"
											transition={CARD_SPRING}
											className="absolute inset-0 rounded-full bg-accent"
										/>
									)}
									<span className="relative">{filter.label}</span>
								</button>
							);
						})}
					</fieldset>
				</LayoutGroup>
			)}

			<motion.ul layout className="mt-8 grid gap-4 lg:grid-cols-2">
				<AnimatePresence mode="popLayout" initial={false}>
					{visibleProjects.map((project) => (
						<motion.li
							key={project.id}
							layout
							initial={{ opacity: 0, scale: 0.94 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.94 }}
							transition={CARD_SPRING}
							className={cn(project.featured && "lg:col-span-2")}
						>
							<ProjectCard project={project} labels={labels} />
						</motion.li>
					))}
				</AnimatePresence>
			</motion.ul>
		</MotionConfig>
	);
}
