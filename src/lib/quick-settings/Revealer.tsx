import type { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';

interface Props {
	children: JSX.Element;
	open: Accessor<boolean>;
}

export function Revealer(props: Props) {
	return (
		<revealer
			hexpand
			revealChild={props.open}
			transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
		>
			<box
				hexpand
				css="margin-top: 8px;"
				orientation={Gtk.Orientation.VERTICAL}
			>
				{props.children}
			</box>
		</revealer>
	);
}
