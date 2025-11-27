import { desktopExtension } from './desktop/extension';
import { systemExtension } from './system/extension';
import { wshellExtension } from './wshell/extension';
import { niriExtension } from './niri/extension';

export const builtInExtensions = [
	desktopExtension,
	niriExtension,
	systemExtension,
	wshellExtension,
];
