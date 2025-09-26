import type { Astal } from 'ags/gtk4';
import { onCleanup } from 'gnim';

export function handleDropdownWindow(window: Astal.Window) {
	onCleanup(() => {
		window.close();
	});

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
