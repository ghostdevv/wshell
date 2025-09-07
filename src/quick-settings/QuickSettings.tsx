import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { Brightness } from './Brightness';
import { MicVolume } from './MicVolume';
import { TopBit } from './TopBit';
import { Volume } from './Volume';
import app from 'ags/gtk4/app';

export default function QuickSettings(props: { monitor: Gdk.Monitor }) {
	const { TOP, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			name="quick-settings"
			class="quick-settings"
			gdkmonitor={props.monitor}
			anchor={TOP | RIGHT}
			application={app}
			defaultHeight={-1}
			defaultWidth={-1}
			keymode={Astal.Keymode.ON_DEMAND}
			onNotifyIsActive={(self) => {
				// hide when window looses focus
				if (self.visible && !self.isActive) {
					self.hide();
				}
			}}
			$={(self) => {
				const keyController = new Gtk.EventControllerKey();

				keyController.connect('key-pressed', (_, key) => {
					if (key === Gdk.KEY_Escape) {
						self.hide();
						return true;
					}

					return false;
				});

				self.add_controller(keyController);
			}}
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
