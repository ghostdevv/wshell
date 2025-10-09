import { createBinding, createState, createComputed } from 'gnim';
import { RevealerItem } from '$lib/quick-settings/RevealerItem';
import { getIconByPercent, textOverflow } from '$lib/common';
import { Revealer } from '$lib/quick-settings/Revealer';
import { IconSlider } from '$lib/slider/IconSlider';
import { Gtk } from 'ags/gtk4';
import Wp from 'gi://AstalWp';
import { For } from 'ags';

export function Volume() {
	const wp = Wp.get_default();
	const defaultSpeaker = wp.defaultSpeaker;
	const defaultSpeakerId = createBinding(defaultSpeaker, 'id');
	const volume = createBinding(defaultSpeaker, 'volume');
	const speakers = createBinding(wp.audio, 'speakers');
	const muted = createBinding(defaultSpeaker, 'mute');

	const [open, setOpen] = createState(false);

	const icon = createComputed((get) => {
		const currentVolume = get(volume);
		const isMuted = get(muted);

		return isMuted
			? ''
			: getIconByPercent(currentVolume, ['', '', ''], '');
	});

	return (
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box spacing={6}>
				<IconSlider
					icon={icon}
					value={volume}
					onChangeValue={(value) => {
						defaultSpeaker.set_volume(value);
						defaultSpeaker.set_mute(value === 0);
					}}
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
				<For each={speakers}>
					{(speaker) => (
						<RevealerItem
							onClick={() => speaker.set_is_default(true)}
							state={defaultSpeakerId.as((id) =>
								speaker.id === id ? 'on' : 'off',
							)}
							label={textOverflow(
								speaker.name || speaker.description,
								32,
							)}
						/>
					)}
				</For>
			</Revealer>
		</box>
	);
}
