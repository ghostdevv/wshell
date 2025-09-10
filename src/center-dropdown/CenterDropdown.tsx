import { DropdownWindow } from '../lib/dropdown/DropdownWindow';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { createPoll } from 'ags/time';
import { format } from 'date-fns';

export default function CenterDropdown(props: { monitor: Gdk.Monitor }) {
	const date = createPoll('', 1000, () => format(new Date(), 'do MMMM yyyy'));
	const time = createPoll('', 500, () => format(new Date(), 'HH:mm:ss'));

	return (
		<DropdownWindow
			name="center-dropdown"
			monitor={props.monitor}
			anchor={Astal.WindowAnchor.TOP}
		>
			<box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
				<box
					class="bit"
					orientation={Gtk.Orientation.VERTICAL}
					spacing={4}
				>
					<label
						label={date}
						halign={Gtk.Align.START}
						css="font-size: 22px;"
					/>

					<label
						label={time}
						halign={Gtk.Align.START}
						css="font-size: 18px;"
					/>
				</box>

				<Gtk.Separator />

				<box class="bit">
					<Gtk.Calendar />
				</box>
			</box>
		</DropdownWindow>
	);
}
