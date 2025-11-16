import type { Extension } from '$lib/extensions/extensions';
import { niriWorkspaces } from './niri/niri-workspaces';
import { indicators } from './indicators/indicators';
import { systemTray } from './tray/system-tray';
import { privacy } from './privacy/privacy';
import { vitals } from './vitals/vitals';
import { clock } from './clock/clock';

export const extensions: Extension[] = [
	niriWorkspaces,
	systemTray,
	clock,
	privacy,
	vitals,
	indicators,
];
