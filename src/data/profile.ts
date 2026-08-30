export interface Social {
	label: string;
	url: string;
	handle: string;
}

export interface Profile {
	name: string;
	displayLines: string[];
	role: string;
	location: string;
	tagline: string;
	metaDescription: string;
	stackSummary: string[];
	email: string;
	socials: Social[];
}

export const profile: Profile = {
	name: "Ivan Martin Prieto",
	displayLines: ["Ivan", "Martin", "Prieto"],
	role: "Full Stack Developer",
	location: "Madrid, Spain",
	tagline:
		"Computer Science Engineer and Full Stack Developer with over five years spent building web and infrastructure projects.",
	metaDescription:
		"Computer Science Engineer and Full Stack Developer based in Madrid, Spain, with over five years of experience building web applications and infrastructure.",
	stackSummary: ["Angular", "React", "TypeScript", "Python", "Java / Spring Boot", "Docker", "Node.js"],
	email: "contact@ivanpmartin.com",
	socials: [
		{ label: "GitHub", url: "https://github.com/c0d3-ngn", handle: "@c0d3-ngn" },
		{ label: "LinkedIn", url: "https://www.linkedin.com/in/ivan-m-p/", handle: "@ivan-m-p" },
	],
};
