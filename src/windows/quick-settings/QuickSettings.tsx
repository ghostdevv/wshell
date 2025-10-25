import { DropdownWindow } from '$lib/dropdown-window/DropdownWindow';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { PowerProfiles } from './PowerProfiles';
import { Brightness } from './Brightness';
import { MicVolume } from './MicVolume';
import { Bluetooth } from './Bluetooth';
import { Network } from './Network';
import { TopBit } from './TopBit';
import { Volume } from './Volume';
import { Keymap } from './Keymap';

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
					<Network />
					<Bluetooth />
					<PowerProfiles />
					<Keymap />
				</box>
			</box>
		</DropdownWindow>
	) as Astal.Window;
}
