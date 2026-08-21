/** Shared vocabulary for the desktop shell. */

/** Every app that opens in a window. */
export type AppId =
	| 'about'
	| 'explorer'
	| 'skills'
	| 'experience'
	| 'contact'
	| 'media'
	| 'settings'
	| 'edge'
	| 'vscode'
	| 'recycle'
	| 'career';

/**
 * A desktop item is either an app that opens in a window, or a shortcut that
 * leaves the page. Modelling both means the desktop grid renders one list.
 */
export type ShortcutId = 'resume' | 'github' | 'linkedin';

export type DesktopItem =
	| { kind: 'app'; id: AppId }
	| { kind: 'link'; id: ShortcutId };

/**
 * The zones Windows 11 offers from its Snap Layouts flyout — four layouts,
 * thirteen reachable positions between them.
 */
export type SnapZone =
	/* Two columns */
	| 'left'
	| 'right'
	/* Four quadrants */
	| 'tl'
	| 'tr'
	| 'bl'
	| 'br'
	/* Three columns */
	| 'third-l'
	| 'third-c'
	| 'third-r'
	/* One wide column beside two stacked */
	| 'wide-l'
	| 'stack-tr'
	| 'stack-br'
	| 'max';

/** The eight grips around a window frame. */
export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export type Rect = { x: number; y: number; w: number; h: number };

export type WindowState = Rect & {
	id: AppId;
	z: number;
	minimised: boolean;
	maximised: boolean;
	/** Set while snapped so the taskbar and title bar can say so. */
	snapped: SnapZone | null;
	/** Geometry before maximise or snap, so restore puts it back. */
	restore?: Rect;
};

/** The desktop area: the viewport minus the taskbar. */
export type Bounds = { w: number; h: number };

/** Windows 11 toast, surfaced in the notification centre once dismissed. */
export type ShellNotification = {
	id: string;
	app: AppId | 'system';
	title: string;
	body: string;
	/** Epoch ms — stamped by the caller so the reducer stays pure. */
	at: number;
	/** Optional action the toast body links to. */
	action?: { label: string; appId: AppId };
};
