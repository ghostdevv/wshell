import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { interval } from 'ags/time';
import { createState } from 'gnim';
import app from 'ags/gtk4/app';
import { format } from 'date-fns';

export default function CenterDropdown(props: { monitor: Gdk.Monitor }) {
	const { TOP } = Astal.WindowAnchor;
	const [now, setNow] = createState(new Date());

	interval(500, () => setNow(new Date()));

	return (
		<window
			name="center-dropdown"
			class="center-dropdown"
			gdkmonitor={props.monitor}
			anchor={TOP}
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
				<box
					class="bit"
					orientation={Gtk.Orientation.VERTICAL}
					spacing={4}
				>
					<label
						halign={Gtk.Align.START}
						label={now.as((now) => format(now, 'do MMMM yyyy'))}
						css="font-size: 22px;"
					/>

					<label
						halign={Gtk.Align.START}
						label={now.as((now) => format(now, 'HH:mm:ss'))}
						css="font-size: 18px;"
					/>
				</box>

				<Gtk.Separator />

				<box class="bit">
					<Gtk.Calendar />
				</box>
			</box>
		</window>
	);
}
