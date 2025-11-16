import CenterDropdown from '../../windows/center-dropdown/CenterDropdown';
import { handleDropdownWindow } from '$lib/dropdown-window/utils';
import { createBarExtension } from '$lib/extensions/bar';
import { displayTime } from '$lib/state/time';
import { Gtk } from 'ags/gtk4';

export const clock = createBarExtension({
	id: 'clock',
	align: 'center',
	render({ monitor }) {
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
	},
});
