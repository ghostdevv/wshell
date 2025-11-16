import { createBinding } from 'gnim';
import { createComputed } from 'ags';
import Wp from 'gi://AstalWp';
import { createBarExtension } from '$lib/extensions/bar';

export const privacy = createBarExtension({
	id: 'privacy',
	align: 'right',
	render() {
		const wp = Wp.get_default();

		const microphones = createBinding(wp.audio, 'recorders');
		const video = createBinding(wp.video, 'recorders');

		const visible = createComputed(
			(get) => !!(get(video).length || get(microphones).length),
		);

		return (
			<box class="group privacy" spacing={8} visible={visible}>
				<label
					class="icon"
					label=""
					visible={microphones.as((v) => !!v.length)}
					tooltipMarkup={microphones.as((v) =>
						v.map((m) => `${m.description}`).join('\n'),
					)}
				/>

				<label
					class="icon"
					label=""
					visible={video.as((v) => !!v.length)}
					tooltipMarkup={video.as((v) =>
						v.map((m) => `${m.description}`).join('\n'),
					)}
				/>
			</box>
		);
	},
});
