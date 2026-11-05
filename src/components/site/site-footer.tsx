import { profile } from '@/data/profile';
import Contact from './contact';

/**
 * A letter close: the last question on its red field, then a sign-off with
 * the name and the place, as a letter ends.
 */
export default function SiteFooter() {
	return (
		<footer className='foot'>
			<Contact />
			<div className='container foot__row'>
				<p className='foot__sign'>
					{profile.name}
					<br />
					{profile.role}, {profile.location}
				</p>
			</div>
		</footer>
	);
}
