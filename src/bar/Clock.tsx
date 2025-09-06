import { Gtk } from 'ags/gtk4';
import { createPoll } from 'ags/time';

export function Clock() {
	const time = createPoll('', 500, 'date +%H:%M:%S');

	return (
		<button $type="start" halign={Gtk.Align.CENTER}>
			<label label={time} />
		</button>
	);
}
