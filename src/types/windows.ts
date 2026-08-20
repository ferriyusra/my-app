/** Shared vocabulary for the desktop shell. */

export type AppId =
	| 'about'
	| 'experience'
	| 'projects'
	| 'skills'
	| 'contact'
	| 'recycle';

/** The zones Windows 11 offers from its Snap Layouts flyout. */
export type SnapZone = 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br' | 'max';

export type WindowState = {
	id: AppId;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	minimised: boolean;
	maximised: boolean;
	/** Geometry before maximise or snap, so restore puts it back. */
	restore?: { x: number; y: number; w: number; h: number };
};

export type Bounds = { w: number; h: number };

/**
 * A desktop item is either an app that opens in a window, or a shortcut that
 * leaves the page. Modelling both means the desktop grid renders one list.
 */
export type ShortcutId = 'resume' | 'github' | 'linkedin';

export type DesktopItem =
	| { kind: 'app'; id: AppId }
	| { kind: 'link'; id: ShortcutId };
