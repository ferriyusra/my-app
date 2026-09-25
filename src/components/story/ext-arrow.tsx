import { LiArrowRight } from '@/components/icons/line-icons';

/**
 * The mark on a link that leaves the site: the same line-icon arrow the
 * story's other links use, turned up and out in CSS.
 *
 * It used to be a "↗" character, which is a glyph a font may or may not draw
 * well — and on some platforms draws as an emoji. One icon family, drawn as
 * SVG, is the rule everywhere else on the page.
 */
export default function ExtArrow({ size = 14 }: { size?: number }) {
	return <LiArrowRight size={size} className='sy-ext' />;
}
