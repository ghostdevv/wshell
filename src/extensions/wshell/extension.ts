import type { Extension } from '$lib/extensions/extensions';

export const wshellExtension: Extension = {
	id: 'wshell',
	components: [
		{
			id: 'clock',
			type: 'bar',
			module: () => import('./clock'),
		},
		{
			id: 'indicators',
			type: 'bar',
			module: () => import('./indicators'),
		},
	],
};
