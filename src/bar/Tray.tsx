import AstalTray from 'gi://AstalTray?version=0.1';
import { For, createBinding } from 'ags';
import { Gtk } from 'ags/gtk4';

export function Tray() {
	const tray = AstalTray.get_default();
	const items = createBinding(tray, 'items');

	return (
		<box
			class="group"
			spacing={8}
			visible={items.as((items) => items.length > 0)}
		>
			<For each={items}>
				{(item) => (
					<button
						class="icon"
						$={(self) => {
							const popover = new Gtk.PopoverMenu();
							popover.set_menu_model(item.get_menu_model());
							popover.set_parent(self);

							self.insert_action_group(
								'dbusmenu',
								item.actionGroup,
							);

							// handle right click
							const gesture = new Gtk.GestureClick();
							gesture.set_button(3);
							gesture.connect('pressed', () => popover.popup());
							self.add_controller(gesture);

							// handle left click
							self.connect('clicked', () => {
								if (item.get_is_menu()) {
									const allocation = self.get_allocation();
									const [, x, y] = self.translate_coordinates(
										self,
										allocation.width / 2,
										allocation.height / 2,
									);

									item.activate(x, y);
								} else {
									popover.popup();
								}
							});
						}}
					>
						<image gicon={item.gicon} />
					</button>
				)}
			</For>
		</box>
	);
}
