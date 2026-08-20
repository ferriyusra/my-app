import { readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Wallpapers dropped into `public/background` by hand.
 *
 * The directory is read on the server, where `page.tsx` renders — a browser
 * cannot list a folder, and `public/` has no index. Because that page is
 * statically prerendered, the read happens at build time and the result is
 * baked into the HTML: no API route, no runtime filesystem access (which is
 * not dependable on serverless hosts anyway), and nothing to fetch.
 *
 * The trade is that a newly added image needs a rebuild to appear in
 * production. That is already true of anything in `public/`, which is uploaded
 * with the deployment. `next dev` re-reads on every request, so adding one
 * locally just needs a refresh.
 */

const DIR = path.join(process.cwd(), 'public', 'background');
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;
/**
 * These names end up inside a CSS `url()`, so anything that could close the
 * quote and start a new declaration is rejected rather than escaped.
 */
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export async function listCustomWallpapers(): Promise<string[]> {
	try {
		const files = await readdir(DIR);
		return files
			.filter((f) => IMAGE.test(f) && SAFE_NAME.test(f))
			.sort((a, b) => a.localeCompare(b));
	} catch {
		/* No directory is the normal case — nobody has added one. */
		return [];
	}
}
