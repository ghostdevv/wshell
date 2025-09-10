import GObject from 'gi://GObject?version=2.0';
import { Astal, Gdk } from 'ags/gtk4';

export function handleDropdownWindow(window: GObject.Object) {
	let instance = window as Astal.Window;

	return {
		toggle() {
			if (!instance.visible) {
				instance.show();
				instance.grab_focus();
			} else {
				instance.hide();
			}
		},
	};
}
