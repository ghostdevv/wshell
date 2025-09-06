import type { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';

interface Props {
	icon: string | Accessor<string>;
	value: number | Accessor<number>;
	onChangeValue: (value: number) => void;
}

export function IconSlider(props: Props) {
	return (
		<box class="icon-slider" hexpand>
			<overlay>
				<label
					$type="overlay"
					halign={Gtk.Align.START}
					label={props.icon}
				/>

				<slider
					hexpand
					min={0}
					max={1}
					value={props.value}
					onChangeValue={({ value }) => props.onChangeValue(value)}
				/>
			</overlay>
		</box>
	);
}
