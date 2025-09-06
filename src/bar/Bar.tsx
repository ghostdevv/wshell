import { WorkspaceIndicator } from './WorkspaceIndicator';
import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { Clock } from './Clock';
import app from 'ags/gtk4/app';

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
				<box $type="start" halign={Gtk.Align.END}>
					<WorkspaceIndicator monitor={gdkmonitor.connector} />
				</box>

				<box $type="center" halign={Gtk.Align.END}>
					<Clock />
				</box>
			</centerbox>
		</window>
	);
}
