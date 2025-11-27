import { builtInExtensions } from '../../extensions/extensions';
import type { BarComponent } from './bar';

type Component = BarComponent;

export interface Extension {
	id: string;
	components: Component[];
}

function fimbleExtensions(rawExtensions: Extension[]) {
	const components = new Map<string, Component>();
	const extensions = new Map<string, Extension>();

	for (const extension of rawExtensions) {
		if (extensions.has(extension.id)) {
			console.warn(`duplicate extension ignored (id: ${extension.id}`);
			continue;
		}

		extensions.set(extension.id, extension);

		for (const component of extension.components) {
			const compositeId = `${extension.id}:${component.id}`;

			if (components.has(compositeId)) {
				console.warn(`duplicate component ignored (id: ${compositeId}`);
				continue;
			}

			components.set(compositeId, component);
		}
	}

	return { components, extensions };
}

export const { extensions, components } = fimbleExtensions(builtInExtensions);
