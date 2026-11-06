import { profile } from '@/data/profile';
import { writtenNotes } from '@/data/notes';
import Masthead from '@/components/site/masthead';
import Hero from '@/components/site/hero';
import Where from '@/components/site/where';
import Tools from '@/components/site/tools';
import Roles from '@/components/site/roles';
import Notes from '@/components/site/notes';
import Projects from '@/components/site/projects';
import SiteFooter from '@/components/site/site-footer';
import PrintExpander from '@/components/content/print-expander';

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: profile.name,
	url: profile.site,
	jobTitle: profile.role,
	description: profile.bio,
	email: profile.email,
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Jakarta',
		addressCountry: 'ID',
	},
	sameAs: [profile.github, profile.linkedin],
};

/**
 * The portfolio as an interview: the five places worked as an index on the
 * first sheet, then the questions a hiring manager would ask, each answered
 * in a line with the depth folded beneath, and a letter close on the red
 * field with the address to write to.
 *
 * Every word is in the response body, folded or not. The only scripts are
 * print-expander, which opens the disclosures before printing, and the one
 * reveal in the layout; the page is finished without either.
 *
 * The case study has no section here. Its home-page section, a decision
 * control on the ultramarine field, was removed on 2026-11-06 at the owner's
 * request: without the write-up's context the control told a new reader
 * nothing. The nav and the Meditap row link to /deposit-alerting instead.
 */
export default function Home() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Masthead />
			<main id='main'>
				<PrintExpander />
				<Hero />
				<Where />
				<Roles />
				<Projects />
				<Tools />
				{writtenNotes().length > 0 && <Notes />}
			</main>
			<SiteFooter />
		</>
	);
}
