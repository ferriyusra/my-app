import type { NextConfig } from 'next';
import { profile } from './src/data/profile';

const nextConfig: NextConfig = {
	/**
	 * The CV at a short address the owner can put in a LinkedIn Featured slot,
	 * an email signature or an ATS note — and that survives the file behind it
	 * being replaced. The Drive URLs stay in profile.ts as the one record of
	 * where the file lives; every button on the site points here.
	 *
	 * Temporary redirects, because the destination is expected to change the
	 * day a new CV is uploaded. /articles was deleted in 9f30192; old links to
	 * it land on the portfolio rather than on a 404.
	 */
	async redirects() {
		return [
			{ source: '/cv', destination: profile.cvDriveView, permanent: false },
			{ source: '/cv.pdf', destination: profile.cvDriveDownload, permanent: false },
			{ source: '/articles', destination: '/', permanent: true },
			{ source: '/articles/:path*', destination: '/', permanent: true },
		];
	},
};

export default nextConfig;
