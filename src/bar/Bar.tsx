import { WorkspaceIndicator } from './WorkspaceIndicator';
import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { Privacy } from './Privacy';
import { Vitals } from './Vitals';
import { Clock } from './Clock';
import app from 'ags/gtk4/app';
import { Tray } from './Tray';

export default function Bar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			visible
			name="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box $type="start" halign={Gtk.Align.END} spacing={8}>
					<WorkspaceIndicator monitor={gdkmonitor.connector} />
					<Tray />
				</box>

				<box $type="center" halign={Gtk.Align.END}>
					<Clock />
				</box>

				<box $type="end" halign={Gtk.Align.END} spacing={8}>
					<Privacy />
					<Vitals />
				</box>
			</centerbox>
		</window>
	);
}
