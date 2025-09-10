import CenterDropdown from '../center-dropdown/CenterDropdown';
import { handleDropdownWindow } from '../lib/dropdown/utils';
import { createPoll } from 'ags/time';
import { Gdk, Gtk } from 'ags/gtk4';
import { format } from 'date-fns';

export function Clock(props: { monitor: Gdk.Monitor }) {
	const time = createPoll('', 500, () => format(new Date(), 'HH:mm:ss'));

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
			<label label={time} />
		</button>
	);
}
