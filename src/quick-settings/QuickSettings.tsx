import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { Volume } from './Volume';
import app from 'ags/gtk4/app';

export default function QuickSettings(gdkmonitor: Gdk.Monitor) {
	const { TOP, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			visible
			name="quick-settings"
			class="quick-settings"
			gdkmonitor={gdkmonitor}
			anchor={TOP | RIGHT}
			application={app}
		>
			<Volume />
		</window>
	);
}
