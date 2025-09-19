import { createBinding, createRoot, onCleanup } from 'gnim';
import type { Gdk } from 'ags/gtk4';
import style from './wshell.scss';
import app from 'ags/gtk4/app';
import Bar from './bar/Bar';

app.start({
	css: style,
	instanceName: 'wshell',
	main() {
		const bars = new Map<string, () => void>();

		function monitorsChanged(monitors: (Gdk.Monitor | null)[]) {
			for (const description of bars.keys()) {
				if (!monitors.some((m) => m?.description === description)) {
					const cleanup = bars.get(description);
					cleanup?.();
				}
			}

			for (const monitor of monitors) {
				if (!monitor || bars.has(monitor.description)) {
					continue;
				}

				createRoot((dispose) => {
					const bar = Bar({ monitor });
					bars.set(monitor.description, () => {
						dispose();
						bar.close();
						bars.delete(monitor.description);
					});
				});
			}
		}

		const monitors = createBinding(app, 'monitors');

		monitorsChanged(app.get_monitors());
		monitors.subscribe(() => monitorsChanged(app.get_monitors()));

		onCleanup(() => {
			for (const cleanup of bars.values()) {
				cleanup();
			}
		});
	},
});
