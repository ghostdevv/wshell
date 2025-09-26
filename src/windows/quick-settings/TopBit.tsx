import { formatDistanceToNow } from 'date-fns';
import { exec, execAsync } from 'ags/process';
import { Gtk } from 'ags/gtk4';
import { notify } from '$lib/notify';

export function TopBit() {
	const uptimeSince = new Date(exec(['uptime', '--since']));
	const uptime = formatDistanceToNow(uptimeSince);
	const user = exec('whoami');

	return (
		<centerbox class="bit">
			<box
				$type="start"
				orientation={Gtk.Orientation.VERTICAL}
				spacing={6}
			>
				<label
					halign={Gtk.Align.START}
					label={`Hey, ${user}!`}
					css="text-transform: capitalize;"
				/>
				<label
					halign={Gtk.Align.START}
					label={`Online for ${uptime}`}
					css="font-size: 12px;"
				/>
			</box>

			<box $type="end" spacing={6}>
				<button
					valign={Gtk.Align.CENTER}
					class="icon outline"
					onClicked={async () => {
						try {
							await execAsync('hyprlock --a');
						} catch (e) {
							console.error('failed to lock screen', e);
							notify({
								title: 'Failed to lock screen',
								message:
									e instanceof Error ? e.message : `${e}`,
							});
						}
					}}
				>
					<label class="icon" label="" />
				</button>

				<button valign={Gtk.Align.CENTER} class="icon outline">
					<label class="icon" label="" />
				</button>
			</box>
		</centerbox>
	);
}
