import type { Child } from '$lib/common';
import type { Gdk } from 'ags/gtk4';
import type {
	BaseExtension,
	BaseExtensionOptions,
	Extension,
} from './extensions';

type Align = 'left' | 'center' | 'right';

type BarExtensionRender = (props: { monitor: Gdk.Monitor }) => Child;

interface BarExtensionOptions extends BaseExtensionOptions {
	id: string;
	align: Align;
	render: BarExtensionRender;
}

export interface BarExtension extends BaseExtension {
	target: 'bar';
	align: Align;
	render: BarExtensionRender;
}

export function createBarExtension(options: BarExtensionOptions): BarExtension {
	return {
		id: options.id,
		target: 'bar',
		align: options.align,
		render: options.render,
	};
}

export function sortExtensions(extensions: Extension[]) {
	const left: BarExtension[] = [];
	const center: BarExtension[] = [];
	const right: BarExtension[] = [];

	for (const extension of extensions) {
		if (extension.target === 'bar') {
			switch (extension.align) {
				case 'left':
					left.push(extension);
					break;
				case 'center':
					center.push(extension);
					break;
				case 'right':
					right.push(extension);
					break;
			}
		}
	}

	return {
		left,
		center,
		right,
	};
}
