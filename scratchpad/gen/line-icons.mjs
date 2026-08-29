/**
 * Regenerates a LineIcons component from the official `lineicons-react`
 * package, in the shape src/components/icons/line-icons.tsx uses: every fill
 * is currentColor, the viewBox is kept, and nothing else ships.
 *
 * Usage, from the repo root:
 *
 *   npm install --no-save lineicons-react
 *   node scratchpad/gen/line-icons.mjs Bulb4 LiBulb
 *   npm uninstall --no-save lineicons-react
 *
 * The first argument is the name the package exports, the second the name
 * this repo uses. Paste the output into line-icons.tsx in alphabetical order.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const icons = require('lineicons-react');

/** DOM attribute → React prop, for the handful these icons actually use. */
const PROP = {
	'fill-rule': 'fillRule',
	'clip-rule': 'clipRule',
	'stroke-width': 'strokeWidth',
	'stroke-linecap': 'strokeLinecap',
	'stroke-linejoin': 'strokeLinejoin',
	'aria-labelledby': null, // the vendored set labels at the call site
};

function attrs(props) {
	const out = [];
	for (const [k, v] of Object.entries(props)) {
		if (k === 'children') continue;
		const name = k in PROP ? PROP[k] : k;
		if (name === null) continue;
		/* The whole point of vendoring: an icon follows the theme. */
		out.push(`${name}="${name === 'fill' && v !== 'none' ? 'currentColor' : v}"`);
	}
	return out.length ? ' ' + out.join(' ') : '';
}

function serialise(node) {
	if (node == null || typeof node !== 'object') return '';
	const kids = [node.props.children]
		.flat(Infinity)
		.filter(Boolean)
		.map(serialise)
		.join('');
	return kids
		? `<${node.type}${attrs(node.props)}>${kids}</${node.type}>`
		: `<${node.type}${attrs(node.props)}></${node.type}>`;
}

const [, , source, name] = process.argv;
const root = icons[source]({});
if (!root) throw new Error(`no icon named ${source}`);

const body = [root.props.children]
	.flat(Infinity)
	.filter(Boolean)
	.map(serialise)
	.map((s) => `\t\t\t${s}`)
	.join('\n');

console.log(`export function ${name}({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='${root.props.viewBox}'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
${body}
		</svg>
	);
}`);
