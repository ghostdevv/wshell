import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { Brightness } from './Brightness';
import { MicVolume } from './MicVolume';
import { TopBit } from './TopBit';
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
			defaultHeight={-1}
			defaultWidth={-1}
		>
			<box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
				<TopBit />

				<Gtk.Separator />

				<box
					class="bit"
					orientation={Gtk.Orientation.VERTICAL}
					spacing={12}
				>
					<Volume />
					<MicVolume />
					<Brightness />
				</box>
			</box>
		</window>
	);
}
