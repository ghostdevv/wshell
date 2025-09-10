import { WorkspaceIndicator } from './WorkspaceIndicator';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { Indicators } from './Indicators';
import { Privacy } from './Privacy';
import { Vitals } from './Vitals';
import { Clock } from './Clock';
import app from 'ags/gtk4/app';
import { Tray } from './Tray';

export default function Bar(props: { monitor: Gdk.Monitor }) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			visible
			name="bar"
			class="bar"
			gdkmonitor={props.monitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box $type="start" halign={Gtk.Align.END} spacing={8}>
					<WorkspaceIndicator monitor={props.monitor.connector} />
					<Tray />
				</box>

				<box $type="center" halign={Gtk.Align.END}>
					<Clock monitor={props.monitor} />
				</box>

				<box $type="end" halign={Gtk.Align.END} spacing={8}>
					<Privacy />
					<Vitals />
					<Indicators monitor={props.monitor} />
				</box>
			</centerbox>
		</window>
	);
}
