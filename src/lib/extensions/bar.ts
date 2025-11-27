import type { Child } from '$lib/common';
import type { Gdk } from 'ags/gtk4';

export type BarRender = (props: { monitor: Gdk.Monitor }) => Child;

export interface BarComponent {
	type: 'bar';
	id: string;
	module: () => Promise<{ render: BarRender }>;
}
