import type { Extension } from '$lib/extensions/extensions';

export const niriExtension: Extension = {
	id: 'niri',
	components: [
		{
			id: 'workspaces',
			type: 'bar',
			module: () => import('./niri-workspaces'),
		},
	],
};
