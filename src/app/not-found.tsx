import Link from 'next/link';
import Masthead from '@/components/site/masthead';
import SiteFooter from '@/components/site/site-footer';

export default function NotFound() {
	return (
		<>
			<Masthead base='/' />
			<main id='main' className='lost'>
				<div className='container'>
					<h1>Nothing at this address</h1>
					<p className='lead'>
						The page may have moved, or the link was mistyped. The portfolio is one
						page, with the case study on a second.
					</p>
					<div className='actions'>
						<Link className='btn btn--primary' href='/'>
							Go to the portfolio
						</Link>
						<Link className='btn' href='/deposit-alerting'>
							Read the case study
						</Link>
					</div>
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
