import { getIconByPercent, textOverflow } from '$lib/common';
import { Revealer } from '$lib/quick-settings/Revealer';
import { IconSlider } from '$lib/slider/IconSlider';
import { createBinding, createState } from 'gnim';
import { Gtk } from 'ags/gtk4';
import Wp from 'gi://AstalWp';
import { For } from 'ags';
import { RevealerItem } from '$lib/quick-settings/RevealerItem';

export function Volume() {
	const wp = Wp.get_default();
	const defaultSpeaker = wp.defaultSpeaker;
	const defaultSpeakerId = createBinding(defaultSpeaker, 'id');
	const volume = createBinding(defaultSpeaker, 'volume');
	const speakers = createBinding(wp.audio, 'speakers');

	const [open, setOpen] = createState(false);

	return (
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box spacing={6}>
				<IconSlider
					value={volume}
					onChangeValue={(value) => defaultSpeaker.set_volume(value)}
					icon={volume.as((v) =>
						getIconByPercent(v, ['', '', ''], ''),
					)}
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
