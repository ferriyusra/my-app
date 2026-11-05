/** 'INA Digital' → 'ina-digital', for an anchor. */
export function slug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Short labels, read without their dashes.
 *
 * A few front-matter strings in `src/data` carry an em dash or an en-dash
 * range ("Backend Engineer — design & implementation", "2025–2026"). They are
 * kept as written there, because `case-study.test.ts` pins them to the
 * author's Markdown. Where the page prints one as a label it reads it through
 * this: an em dash between phrases becomes a comma, a range becomes "to".
 */
export function label(text: string): string {
	return prose(text).replace(/\s+&\s+/g, ' and ');
}

/**
 * Running prose, as the page prints it: the author's words with the em dashes
 * set as commas and the en-dash ranges as "to".
 *
 * The data keeps the author's punctuation (the case study is pinned to the
 * Markdown it was transcribed from, and the Markdown is linked as written).
 * The page does not print an em or en dash in visible copy, so the change is
 * made here, at the one point every renderer passes through, rather than in
 * the data. A dash in code is left alone: code is never passed through this.
 */
export function prose(text: string): string {
	return text
		.replace(/(\d)\s*[–—]\s*(\d)/g, '$1 to $2')
		.replace(/\s*—\s*/g, ', ')
		.replace(/\s+–\s+/g, ', ')
		.replace(/,\s*,/g, ',')
		.replace(/,\s*([.;:])/g, '$1');
}
