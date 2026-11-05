import { profile } from '@/data/profile';
import { writtenNotes } from '@/data/notes';
import Masthead from '@/components/site/masthead';
import Hero from '@/components/site/hero';
import Tools from '@/components/site/tools';
import Roles from '@/components/site/roles';
import CasePreview from '@/components/site/case-preview';
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
 * Every word is in the response body, folded or not. The only script is
 * print-expander, which opens the disclosures before printing.
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
				<Tools />
				<Roles />
				<CasePreview />
				{writtenNotes().length > 0 && <Notes />}
				<Projects />
			</main>
			<SiteFooter />
		</>
	);
}
