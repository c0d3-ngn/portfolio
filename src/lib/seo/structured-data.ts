export type JsonLdNode = Record<string, unknown>;

export interface ImageInfo {
	url: string;
	width: number;
	height: number;
}

export interface StructuredDataProject {
	name: string;
	description: string;
	technologies: string[];
	repository?: string;
}

export interface StructuredDataInput {
	siteUrl: string;
	pageUrl: string;
	locale: string;
	locales: readonly string[];
	title: string;
	description: string;
	person: {
		name: string;
		jobTitle: string;
		description: string;
		email: string;
		locality: string;
		countryCode: string;
		knowsAbout: string[];
		knowsLanguage: string[];
		sameAs: string[];
		employer?: string;
	};
	avatar: ImageInfo;
	socialImage: ImageInfo;
	projects: StructuredDataProject[];
}

function imageObject(image: ImageInfo, id?: string): JsonLdNode {
	return {
		"@type": "ImageObject",
		...(id && { "@id": id }),
		url: image.url,
		contentUrl: image.url,
		width: image.width,
		height: image.height,
	};
}

/**
 * Builds the page's schema.org graph: one `Person` shared by every locale, a `WebSite`, this
 * locale's `ProfilePage`, and one `CreativeWork` per project. Nodes reference each other by
 * `@id` so search engines resolve a single entity.
 */
export function buildStructuredData(input: StructuredDataInput): { "@context": string; "@graph": JsonLdNode[] } {
	const { siteUrl, pageUrl, person } = input;
	const personId = `${siteUrl}#person`;
	const websiteId = `${siteUrl}#website`;
	const pageId = `${pageUrl}#webpage`;

	const personNode: JsonLdNode = {
		"@type": "Person",
		"@id": personId,
		name: person.name,
		jobTitle: person.jobTitle,
		description: person.description,
		url: pageUrl,
		email: `mailto:${person.email}`,
		image: imageObject(input.avatar, `${siteUrl}#avatar`),
		address: {
			"@type": "PostalAddress",
			addressLocality: person.locality,
			addressCountry: person.countryCode,
		},
		knowsAbout: person.knowsAbout,
		knowsLanguage: person.knowsLanguage,
		...(person.employer && { worksFor: { "@type": "Organization", name: person.employer } }),
		sameAs: person.sameAs,
		mainEntityOfPage: { "@id": pageId },
	};

	const websiteNode: JsonLdNode = {
		"@type": "WebSite",
		"@id": websiteId,
		url: siteUrl,
		name: person.name,
		inLanguage: [...input.locales],
		publisher: { "@id": personId },
	};

	const pageNode: JsonLdNode = {
		"@type": "ProfilePage",
		"@id": pageId,
		url: pageUrl,
		name: input.title,
		description: input.description,
		inLanguage: input.locale,
		isPartOf: { "@id": websiteId },
		mainEntity: { "@id": personId },
		about: { "@id": personId },
		primaryImageOfPage: imageObject(input.socialImage),
	};

	const projectNodes: JsonLdNode[] = input.projects.map((project, index) => ({
		"@type": project.repository ? ["CreativeWork", "SoftwareSourceCode"] : "CreativeWork",
		"@id": `${pageUrl}#project-${index + 1}`,
		name: project.name,
		description: project.description,
		inLanguage: input.locale,
		keywords: project.technologies.join(", "),
		author: { "@id": personId },
		isPartOf: { "@id": pageId },
		...(project.repository && { codeRepository: project.repository }),
	}));

	return { "@context": "https://schema.org", "@graph": [personNode, websiteNode, pageNode, ...projectNodes] };
}
