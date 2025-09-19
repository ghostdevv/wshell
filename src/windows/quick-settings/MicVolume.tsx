import { IconSlider } from '../../lib/slider/IconSlider';
import { createBinding, createState } from 'gnim';
import { textOverflow } from '../../common';
import Gtk from 'gi://Gtk?version=4.0';
import Wp from 'gi://AstalWp';
import { For } from 'ags';

export function MicVolume() {
	const wp = Wp.get_default();
	const defaultMic = wp.defaultMicrophone;
	const defaultMicId = createBinding(defaultMic, 'id');
	const volume = createBinding(defaultMic, 'volume');
	const mics = createBinding(wp.audio, 'microphones');

	const [open, setOpen] = createState(false);

	return (
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box spacing={6}>
				<IconSlider
					value={volume}
					onChangeValue={(value) => defaultMic.set_volume(value)}
					icon={volume.as((v) => (v === 0 ? '' : ''))}
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

			<revealer
				halign={Gtk.Align.START}
				transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
				revealChild={open}
			>
				<box
					css="margin-top: 8px;"
					orientation={Gtk.Orientation.VERTICAL}
				>
					<For each={mics}>
						{(mic) => (
							<button onClicked={() => mic.set_is_default(true)}>
								<box spacing={6}>
									<label
										widthRequest={14}
										css="font-size: 12px;"
										class="icon fas"
										label={defaultMicId.as((id) =>
											mic.id === id ? '' : '',
										)}
									/>

									<label
										halign={Gtk.Align.START}
										label={textOverflow(
											mic.name || mic.description,
											32,
										)}
									/>
								</box>
							</button>
						)}
					</For>
				</box>
			</revealer>
		</box>
	);
}
