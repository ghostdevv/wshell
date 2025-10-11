import { DropdownWindow } from '$lib/dropdown-window/DropdownWindow';
import { displayDate, displayTime } from '$lib/state/time';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';

export default function CenterDropdown(props: { monitor: Gdk.Monitor }) {
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
						label={displayDate}
						halign={Gtk.Align.START}
						css="font-size: 22px;"
					/>

					<label
						label={displayTime}
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
	) as Astal.Window;
}
