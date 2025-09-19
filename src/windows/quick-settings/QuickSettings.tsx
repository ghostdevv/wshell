import { DropdownWindow } from '../../lib/dropdown/DropdownWindow';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { Brightness } from './Brightness';
import { MicVolume } from './MicVolume';
import { TopBit } from './TopBit';
import { Volume } from './Volume';

export default function QuickSettings(props: { monitor: Gdk.Monitor }) {
	const { TOP, RIGHT } = Astal.WindowAnchor;

	return (
		<DropdownWindow
			name="quick-settings"
			anchor={TOP | RIGHT}
			monitor={props.monitor}
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
		</DropdownWindow>
	) as Astal.Window;
}
