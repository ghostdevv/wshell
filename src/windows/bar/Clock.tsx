import { handleDropdownWindow } from '$lib/dropdown-window/utils';
import CenterDropdown from '../center-dropdown/CenterDropdown';
import { displayTime } from '$lib/state/time';
import { type Gdk, Gtk } from 'ags/gtk4';

export function Clock(props: { monitor: Gdk.Monitor }) {
	const centerDropdownWindow = handleDropdownWindow(
		CenterDropdown({
			monitor: props.monitor,
		}),
	);

	return (
		<button
			$type="start"
			halign={Gtk.Align.CENTER}
			onClicked={() => centerDropdownWindow.toggle()}
		>
			<label label={displayTime} />
		</button>
	);
}
