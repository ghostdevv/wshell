import { DropdownWindow } from '../lib/dropdown/DropdownWindow';
import { Astal, Gtk, Gdk } from 'ags/gtk4';
import { interval } from 'ags/time';
import { createState } from 'gnim';
import { format } from 'date-fns';

export default function CenterDropdown(props: { monitor: Gdk.Monitor }) {
	const { TOP } = Astal.WindowAnchor;
	const [now, setNow] = createState(new Date());

	interval(500, () => setNow(new Date()));

	return (
		<DropdownWindow
			name="center-dropdown"
			monitor={props.monitor}
			anchor={TOP}
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
		</DropdownWindow>
	);
}
