import QuickSettings from './quick-settings/QuickSettings';
import GObject from 'gi://GObject?version=2.0';
import { createBinding } from 'gnim';
import type { Gdk } from 'ags/gtk4';
import style from './wshell.scss';
import app from 'ags/gtk4/app';
import Bar from './bar/Bar';
import type Astal from 'gi://Astal';

app.start({
	css: style,
	instanceName: 'wshell',
	main() {
		const windows = new Map<string, Astal.Window>();

		function handleMonitors(monitors: Gdk.Monitor[]) {
			for (const monitor of monitors) {
				if (monitor.is_valid() && !windows.has(monitor.connector)) {
					windows.set(
						monitor.connector,
						Bar({ monitor }) as Astal.Window,
					);
				}
			}

			for (const [connector, window] of windows.entries()) {
				const monitor = monitors.find((m) => m.connector === connector);
				if (!monitor || !monitor.is_valid()) {
					window.destroy();
					windows.delete(connector);
				}
			}
		}

		const monitors = createBinding(app, 'monitors');
		handleMonitors(monitors.get());
		monitors.subscribe(() => handleMonitors(monitors.get()));

		// app.get_monitors().map(Bar);
		// app.get_monitors().map(QuickSettings);
	},
});
