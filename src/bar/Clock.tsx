import CenterDropdown from '../center-dropdown/CenterDropdown';
import { createPoll } from 'ags/time';
import type Astal from 'gi://Astal';
import { Gdk, Gtk } from 'ags/gtk4';

export function Clock(props: { monitor: Gdk.Monitor }) {
	const time = createPoll('', 500, 'date +%H:%M:%S');

	let centerDropdownWindow = CenterDropdown({
		monitor: props.monitor,
	}) as Astal.Window;

	return (
		<button
			$type="start"
			halign={Gtk.Align.CENTER}
			onClicked={() => {
				if (!centerDropdownWindow.visible) {
					centerDropdownWindow.show();
					centerDropdownWindow.grab_focus();
				} else {
					centerDropdownWindow.hide();
				}
			}}
		>
			<label label={time} />
		</button>
	);
}
