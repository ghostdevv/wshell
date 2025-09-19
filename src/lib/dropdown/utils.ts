import type { Astal } from 'ags/gtk4';

export function handleDropdownWindow(window: Astal.Window) {
	return {
		toggle() {
			if (!window.visible) {
				window.show();
				window.grab_focus();
			} else {
				window.hide();
			}
		},
	};
}
