import { Astal, Gtk, Gdk } from 'ags/gtk4';
import app from 'ags/gtk4/app';

interface Props {
	name: string;
	monitor: Gdk.Monitor;
	children: JSX.Element;
	anchor: Astal.WindowAnchor;
}

export function DropdownWindow(props: Props) {
	return (
		<window
			name={props.name}
			class={props.name}
			gdkmonitor={props.monitor}
			anchor={props.anchor}
			application={app}
			defaultHeight={-1}
			defaultWidth={-1}
			keymode={Astal.Keymode.ON_DEMAND}
			onNotifyIsActive={(self) => {
				// hide when window looses focus
				if (self.visible && !self.isActive) {
					self.hide();
				}
			}}
			$={(self) => {
				const keyController = new Gtk.EventControllerKey();

				keyController.connect('key-pressed', (_, key) => {
					if (key === Gdk.KEY_Escape) {
						self.hide();
						return true;
					}

					return false;
				});

				self.add_controller(keyController);
			}}
		>
			{props.children}
		</window>
	);
}
