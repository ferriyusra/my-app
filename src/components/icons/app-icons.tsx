/**
 * App icons.
 *
 * These were hand-drawn SVG until this pass — shaped, multi-colour compositions
 * on the reasoning that Windows 11 ships no line-art app icons. They are now
 * LineIcons, at the owner's request, and the drawings are kept in git history
 * (see the commit that replaced this file) rather than here.
 *
 * The names and the `size` prop are unchanged, so the seven files that import
 * from here did not have to move. The art comes from
 * [line-icons.tsx](./line-icons.tsx), which is generated — see the header there
 * for why LineIcons is vendored rather than installed.
 *
 * One consequence worth knowing: a LineIcons glyph is a single `currentColor`
 * shape, so GitHub is no longer black-on-white and LinkedIn is no longer blue.
 * Every icon now takes the colour of whatever it sits in.
 */

export type IconProps = { size?: number; className?: string };

export {
	TipsIcon,
	FolderIcon,
	CodeIcon,
	RecycleIcon,
	DocumentIcon,
	ThisPcIcon,
	PersonIcon,
	LayersIcon,
	BriefcaseIcon,
	CareerIcon,
	MailIcon,
	GearIcon,
	GitHubIcon,
	LinkedInIcon,
	MediaIcon,
	TerminalIcon,
} from './line-icons';
