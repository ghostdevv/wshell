import { createBinding, createState, createComputed } from 'gnim';
import { RevealerItem } from '$lib/quick-settings/RevealerItem';
import { Revealer } from '$lib/quick-settings/Revealer';
import { IconSlider } from '$lib/slider/IconSlider';
import { textOverflow } from '$lib/common';
import { Gtk } from 'ags/gtk4';
import Wp from 'gi://AstalWp';
import { For } from 'ags';

export function MicVolume() {
	const wp = Wp.get_default();
	const defaultMic = wp.defaultMicrophone;
	const defaultMicId = createBinding(defaultMic, 'id');
	const volume = createBinding(defaultMic, 'volume');
	const mics = createBinding(wp.audio, 'microphones');
	const muted = createBinding(defaultMic, 'mute');

	const [open, setOpen] = createState(false);

	const icon = createComputed((get) => {
		const currentVolume = get(volume);
		const isMuted = get(muted);
		console.log({ isMuted });

		return isMuted || currentVolume === 0 ? '' : '';
	});

	return (
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box spacing={6}>
				<IconSlider
					value={volume}
					onChangeValue={(value) => {
						defaultMic.set_volume(value);
						defaultMic.set_mute(value === 0);
					}}
					icon={icon}
				/>

				<button class="icon" onClicked={() => setOpen(!open.get())}>
					<label
						label=""
						valign={Gtk.Align.CENTER}
						cssClasses={open.as((open) => [
							'chevron',
							open ? 'down' : '',
						])}
					/>
				</button>
			</box>

			<Revealer open={open}>
				<For each={mics}>
					{(mic) => (
						<RevealerItem
							onClick={() => mic.set_is_default(true)}
							state={defaultMicId.as((id) =>
								mic.id === id ? 'on' : 'off',
							)}
							label={textOverflow(
								mic.name || mic.description,
								32,
							)}
						/>
					)}
				</For>
			</Revealer>
		</box>
	);
}
