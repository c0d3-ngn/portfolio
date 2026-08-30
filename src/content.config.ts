import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PROJECT_PREVIEW_MODES } from "@/types/content";

export const projectSchema = z.object({
	title: z.string(),
	summary: z.string().optional(),
	stack: z.array(z.string()),
	tags: z.array(z.string()).default([]),
	repo: z.url().optional(),
	demo: z.url().optional(),
	featured: z.boolean().default(false),
	order: z.number(),
	preview: z.enum([...PROJECT_PREVIEW_MODES]).optional(),
	previewLabel: z.string().optional(),
});

export const careerSchema = z.object({
	role: z.string(),
	company: z.string(),
	start: z.coerce.date(),
	end: z.coerce.date().optional(),
	location: z.string().optional(),
	stack: z.array(z.string()).default([]),
});

const projects = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
	schema: projectSchema,
});

const career = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
	schema: careerSchema,
});

const about = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
	schema: z.object({
		heading: z.string(),
	}),
});

export const collections = { projects, career, about };
