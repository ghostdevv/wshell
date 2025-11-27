import type { Extension } from '$lib/extensions/extensions';

export const systemExtension: Extension = {
	id: 'system',
	components: [
		{
			id: 'vitals',
			type: 'bar',
			module: () => import('./vitals'),
		},
	],
};
