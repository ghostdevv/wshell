import { WorkspaceIndicator } from './WorkspaceIndicator';
import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { createPoll } from 'ags/time';
import app from 'ags/gtk4/app';

function Clock() {
	const time = createPoll('', 500, 'date +%H:%M:%S');

	return (
		<button $type="start" halign={Gtk.Align.CENTER}>
			<label label={time} />
		</button>
	);
}

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
