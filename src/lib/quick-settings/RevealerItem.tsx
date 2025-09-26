import { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';

export type RevealerItemState = 'on' | 'off' | 'busy';

interface Props {
	onClick: () => void;
	state: Accessor<RevealerItemState>;
	label: string | Accessor<string> | JSX.Element;
}

function isStringish(value: unknown): value is string | Accessor<string> {
	return typeof value === 'string' || value instanceof Accessor;
}

export function RevealerItem(props: Props) {
	return (
		<button hexpand onClicked={props.onClick}>
			<box spacing={6} hexpand>
				<label
					widthRequest={14}
					css="font-size: 12px;"
					label={props.state.as((state) =>
						state === 'on' ? '' : state === 'busy' ? '' : '',
					)}
					class={props.state.as(
						(state) => `icon fas ${state === 'busy' ? 'spin' : ''}`,
					)}
				/>

				{isStringish(props.label) ? (
					<label label={props.label} halign={Gtk.Align.START} />
				) : (
					props.label
				)}
			</box>
		</button>
	);
}
