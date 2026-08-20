/**
 * The tech stack, grouped the way the Skills window presents it.
 *
 * `years` is hands-on use derived from the dates in `experience.ts`. Nothing
 * displays it any more — it orders each category so the tools reached for
 * most sit at the top, which is the only ranking here that means anything.
 *
 * `icon` points at a brand mark in `public/icons`. Where no mark ships, the
 * card falls back to a lettered plate rather than a broken image.
 */

export type SkillCategory =
	| 'Backend'
	| 'Frontend'
	| 'Database'
	| 'DevOps'
	| 'Cloud'
	| 'AI Tools';

export type Skill = {
	name: string;
	category: SkillCategory;
	icon?: string;
	/** Near-black brand marks need inverting on a dark surface. */
	adaptive?: boolean;
	years: number;
	/** Where it was actually used. */
	note: string;
};

export const SKILL_CATEGORIES: {
	key: SkillCategory;
	blurb: string;
}[] = [
	{ key: 'Backend', blurb: 'Services, APIs and event-driven work' },
	{ key: 'Frontend', blurb: 'Internal tools and dashboards' },
	{ key: 'Database', blurb: 'Stores and caches behind those services' },
	{ key: 'DevOps', blurb: 'Build, ship and watch it run' },
	{ key: 'Cloud', blurb: 'Google Cloud, mostly' },
	{ key: 'AI Tools', blurb: 'Daily driver tooling' },
];

export const skills: Skill[] = [
	/* ── Backend ── */
	{ name: 'Go', category: 'Backend', icon: '/icons/go.svg', years: 3, note: 'Gin services at Meditap, SATUSEHAT, Moladin' },
	{ name: 'Node.js', category: 'Backend', icon: '/icons/nodedotjs.svg', years: 4, note: 'Primary runtime since 2021' },
	{ name: 'NestJS', category: 'Backend', icon: '/icons/nestjs.svg', years: 2, note: 'SATUSEHAT Data Product APIs' },
	{ name: 'Express.js', category: 'Backend', icon: '/icons/express.svg', adaptive: true, years: 3, note: 'Moladin product lines' },

	/* ── Frontend ── */
	{ name: 'TypeScript', category: 'Frontend', icon: '/icons/typescript.svg', years: 4, note: 'Across every recent codebase' },
	{ name: 'React', category: 'Frontend', icon: '/icons/react.svg', years: 3, note: 'Internal CMS tools at Meditap' },
	{ name: 'Next.js', category: 'Frontend', icon: '/icons/nextdotjs.svg', adaptive: true, years: 2, note: 'Dashboards and this desktop' },
	{ name: 'JavaScript', category: 'Frontend', icon: '/icons/javascript.svg', years: 4, note: 'Where TypeScript is not' },
	{ name: 'Tailwind CSS', category: 'Frontend', icon: '/icons/tailwindcss.svg', years: 2, note: 'Side projects and this site' },

	/* ── Database ── */
	{ name: 'PostgreSQL', category: 'Database', icon: '/icons/postgresql.svg', years: 4, note: 'Default store on every role' },
	{ name: 'MySQL', category: 'Database', icon: '/icons/mysql.svg', years: 3, note: 'Moladin and Jojonomic' },
	{ name: 'MongoDB', category: 'Database', icon: '/icons/mongodb.svg', years: 3, note: 'Dashboard aggregates' },
	{ name: 'Redis', category: 'Database', icon: '/icons/redis.svg', years: 3, note: 'Caching layer for BI endpoints' },
	{ name: 'BigQuery', category: 'Database', years: 2, note: 'National-scale health datasets' },

	/* ── DevOps ── */
	{ name: 'Docker', category: 'DevOps', icon: '/icons/docker.svg', years: 3, note: 'Service packaging' },
	{ name: 'Git', category: 'DevOps', icon: '/icons/git.svg', years: 4, note: 'Trunk-based, reviewed' },
	{ name: 'Datadog', category: 'DevOps', years: 2, note: 'API latency and error-rate monitors' },
	{ name: 'Kafka', category: 'DevOps', years: 1, note: 'Producers and consumers at Moladin' },
	{ name: 'Keycloak', category: 'DevOps', years: 1, note: 'Role-based access across services' },
	{ name: 'KrakenD', category: 'DevOps', years: 1, note: 'API gateway configuration' },

	/* ── Cloud ── */
	{ name: 'Google Cloud', category: 'Cloud', icon: '/icons/googlecloud.svg', years: 3, note: 'Primary platform since 2023' },
	{ name: 'Pub/Sub', category: 'Cloud', icon: '/icons/googlepubsub.svg', years: 1, note: 'Event-driven billing notifications' },
	{ name: 'Cloud Scheduler', category: 'Cloud', icon: '/icons/cloudscheduler.svg', years: 1, note: 'Scheduled billing runs' },
	{ name: 'AWS', category: 'Cloud', icon: '/icons/aws.svg', years: 2, note: 'Earlier product infrastructure' },

	/* ── AI Tools ── */
	{ name: 'Claude', category: 'AI Tools', icon: '/icons/anthropic.svg', years: 2, note: 'Refactoring and review, daily' },
	{ name: 'ChatGPT', category: 'AI Tools', icon: '/icons/openai.svg', years: 2, note: 'Design exploration' },
	{ name: 'GitHub Copilot', category: 'AI Tools', icon: '/icons/githubcopilot.svg', adaptive: true, years: 2, note: 'In-editor completion' },
	{ name: 'Cursor', category: 'AI Tools', icon: '/icons/cursor.svg', years: 1, note: 'Multi-file edits' },
];
