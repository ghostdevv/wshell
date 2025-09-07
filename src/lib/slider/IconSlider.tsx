import type { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';

interface Props {
	icon: string | Accessor<string>;
	value: number | Accessor<number>;
	onChangeValue: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
}

export function IconSlider(props: Props) {
	return (
		<box class="icon-slider" hexpand>
			<overlay>
				<label
					$type="overlay"
					halign={Gtk.Align.START}
					label={props.icon}
					class="icon"
				/>

				<slider
					hexpand
					min={props.min ?? 0}
					max={props.max ?? 1}
					step={props.step ?? 0.05}
					value={props.value}
					onChangeValue={({ value }) => props.onChangeValue(value)}
				/>
			</overlay>
		</box>
	);
}
