import type { Extension } from '$lib/extensions/extensions';

export const desktopExtension: Extension = {
	id: 'desktop',
	components: [
		{
			id: 'privacy',
			type: 'bar',
			module: () => import('./privacy'),
		},
		{
			id: 'tray',
			type: 'bar',
			module: () => import('./system-tray'),
		},
	],
};
