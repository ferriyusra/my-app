import { profile } from '@/data/profile';
import { monthShort } from '@/lib/dates';
import Contact from './contact';

/**
 * The close, then the sheet's title block: the keylined cells a drawing ends
 * on, holding who drew it, as what, and when it was last revised (the month
 * the "now" lines were written). The links elsewhere sit beside the address
 * in the close, where a reader is looking for them. Every value comes from
 * `profile.ts`.
 */
export default function SiteFooter() {
	return (
		<footer className='foot'>
			<Contact />
			<div className='container'>
				<dl className='titleblock foot__block'>
					<div>
						<dt>Drawn by</dt>
						<dd>{profile.name}</dd>
					</div>
					<div>
						<dt>Role</dt>
						<dd>{profile.role}</dd>
					</div>
					<div>
						<dt>Revised</dt>
						<dd className='num'>{monthShort(profile.nowUpdated)}</dd>
					</div>
				</dl>
			</div>
		</footer>
	);
}
