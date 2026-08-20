import type { ReactNode } from 'react';

/**
 * One row in an Explorer folder.
 *
 * Projects, documents, apps and web shortcuts all reduce to this shape, which
 * is what lets a single grid / list / details renderer draw every location
 * instead of one component per folder.
 */
export type FsEntry = {
	id: string;
	name: string;
	/** The Details view's Type column: "Project folder", "PDF document"… */
	type: string;
	/** Secondary line: stack, size, destination. */
	meta: string;
	icon: ReactNode;
	/** Present when opening leaves the page. */
	href?: string;
	onOpen: () => void;
};
