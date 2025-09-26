import { getIconByPercent, textOverflow } from '$lib/common';
import { Revealer } from '$lib/quick-settings/Revealer';
import { IconSlider } from '$lib/slider/IconSlider';
import { createBinding, createState } from 'gnim';
import { Gtk } from 'ags/gtk4';
import Wp from 'gi://AstalWp';
import { For } from 'ags';

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
						getIconByPercent(v, ['', '', '']),
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
						<button onClicked={() => speaker.set_is_default(true)}>
							<box spacing={6}>
								<label
									widthRequest={14}
									css="font-size: 12px;"
									class="icon fas"
									label={defaultSpeakerId.as((id) =>
										speaker.id === id ? '' : '',
									)}
								/>

								<label
									halign={Gtk.Align.START}
									label={textOverflow(
										speaker.name || speaker.description,
										32,
									)}
								/>
							</box>
						</button>
					)}
				</For>
			</Revealer>
		</box>
	);
}
