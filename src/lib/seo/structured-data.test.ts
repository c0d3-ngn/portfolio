import { describe, expect, it } from "vitest";
import { buildStructuredData, type JsonLdNode, type StructuredDataInput } from "./structured-data";

const input: StructuredDataInput = {
	siteUrl: "https://example.com/",
	pageUrl: "https://example.com/es/",
	locale: "es",
	locales: ["en", "es"],
	title: "Ada — Ingeniera en Londres",
	description: "Descripción.",
	person: {
		name: "Ada Lovelace",
		jobTitle: "Ingeniera",
		description: "Construye máquinas.",
		email: "ada@example.com",
		locality: "London",
		countryCode: "GB",
		knowsAbout: ["Math"],
		knowsLanguage: ["en", "es"],
		sameAs: ["https://github.com/ada"],
		employer: "Babbage & Co",
	},
	avatar: { url: "https://example.com/avatar.png", width: 301, height: 301 },
	socialImage: { url: "https://example.com/og.png", width: 1200, height: 630 },
	projects: [
		{
			name: "Engine",
			description: "A computer.",
			technologies: ["Brass", "Python"],
			repository: "https://github.com/ada/engine",
		},
		{ name: "Notes", description: "Annotations.", technologies: ["Docker"] },
	],
};

const graph = buildStructuredData(input)["@graph"];
const byType = (type: string) => graph.filter((node) => [node["@type"]].flat().includes(type));

function collectReferences(value: unknown, found: string[] = []): string[] {
	if (Array.isArray(value)) for (const item of value) collectReferences(item, found);
	else if (value && typeof value === "object") {
		const record = value as JsonLdNode;
		const keys = Object.keys(record);
		if (keys.length === 1 && keys[0] === "@id") found.push(String(record["@id"]));
		else for (const child of Object.values(record)) collectReferences(child, found);
	}
	return found;
}

describe("buildStructuredData", () => {
	it("produces a schema.org graph with the expected node types", () => {
		expect(buildStructuredData(input)["@context"]).toBe("https://schema.org");
		expect(byType("Person")).toHaveLength(1);
		expect(byType("WebSite")).toHaveLength(1);
		expect(byType("ProfilePage")).toHaveLength(1);
		expect(byType("CreativeWork")).toHaveLength(2);
	});

	it("gives every node a unique @id", () => {
		const ids = graph.map((node) => String(node["@id"]));
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("resolves every @id reference inside the graph", () => {
		const ids = new Set(graph.map((node) => node["@id"]));
		for (const reference of collectReferences(graph)) expect(ids.has(reference)).toBe(true);
	});

	it("keeps the Person @id stable across locales", () => {
		const english = buildStructuredData({ ...input, locale: "en", pageUrl: "https://example.com/" })["@graph"];
		expect(english[0]?.["@id"]).toBe(graph[0]?.["@id"]);
	});

	it("describes the person with a structured address and employer", () => {
		const person = byType("Person")[0] as JsonLdNode;
		expect(person.address).toEqual({ "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" });
		expect(person.worksFor).toEqual({ "@type": "Organization", name: "Babbage & Co" });
		expect(person.email).toBe("mailto:ada@example.com");
	});

	it("omits worksFor when there is no employer", () => {
		const withoutEmployer = buildStructuredData({ ...input, person: { ...input.person, employer: undefined } });
		expect(withoutEmployer["@graph"][0]).not.toHaveProperty("worksFor");
	});

	it("marks only projects with a repository as source code", () => {
		const [engine, notes] = byType("CreativeWork") as JsonLdNode[];
		expect(engine?.["@type"]).toEqual(["CreativeWork", "SoftwareSourceCode"]);
		expect(engine?.codeRepository).toBe("https://github.com/ada/engine");
		expect(notes?.["@type"]).toBe("CreativeWork");
		expect(notes).not.toHaveProperty("codeRepository");
	});

	it("links the profile page to the person and the website", () => {
		const page = byType("ProfilePage")[0] as JsonLdNode;
		expect(page.mainEntity).toEqual({ "@id": "https://example.com/#person" });
		expect(page.isPartOf).toEqual({ "@id": "https://example.com/#website" });
		expect(page.inLanguage).toBe("es");
	});

	it("serializes to valid JSON without undefined leaks", () => {
		const text = JSON.stringify(buildStructuredData(input));
		expect(JSON.parse(text)["@graph"]).toHaveLength(graph.length);
		expect(text).not.toContain("undefined");
	});
});
