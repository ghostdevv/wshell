import type { BarExtension } from './bar';

export interface BaseExtensionOptions {
	id: string;
}

export interface BaseExtension {
	id: string;
}

export type Extension = BarExtension;
