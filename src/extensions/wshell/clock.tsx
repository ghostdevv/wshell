import CenterDropdown from '../../windows/center-dropdown/CenterDropdown';
import { handleDropdownWindow } from '$lib/dropdown-window/utils';
import type { BarRender } from '$lib/extensions/bar';
import { displayTime } from '$lib/state/time';
import { Gtk } from 'ags/gtk4';

export const render: BarRender = ({ monitor }) => {
	const centerDropdownWindow = handleDropdownWindow(
		CenterDropdown({
			monitor,
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
};
