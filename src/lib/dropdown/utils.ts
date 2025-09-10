import type GObject from 'gi://GObject?version=2.0';
import type { Astal } from 'ags/gtk4';

export function handleDropdownWindow(window: GObject.Object) {
	const instance = window as Astal.Window;

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
