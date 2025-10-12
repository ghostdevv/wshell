import { monitorFile, readFileAsync } from 'ags/file';
import { execAsync } from 'ags/process';
import { notify } from '$lib/notify';
import { createState } from 'gnim';
import { Gtk } from 'ags/gtk4';

const KEYMAPS = ['uk', 'us'] as const;
type Keymap = (typeof KEYMAPS)[number];

export function Keymap() {
	const [keymap, setKeymap] = createState<Keymap | null>(null);

	async function updateKeymap() {
		const content = await readFileAsync('/etc/vconsole.conf');
		const keymap = (content.match(/KEYMAP=(\w+)/)?.[1] as Keymap) || null;
		setKeymap(keymap);
	}

	updateKeymap();
	monitorFile('/etc/vconsole.conf', updateKeymap);

	return (
		<box visible={keymap !== null} hexpand>
			<button
				hexpand
				onClicked={async () => {
					const current = keymap.get();

					if (current) {
						const next =
							(KEYMAPS.indexOf(current) + 1) % KEYMAPS.length;

						try {
							await execAsync([
								'localectl',
								'set-keymap',
								KEYMAPS[next],
							]);
						} catch (e) {
							notify({
								title: 'Failed to lock screen',
								message:
									e instanceof Error ? e.message : `${e}`,
							});
						}
					}
				}}
			>
				<box spacing={6}>
					<label class="icon" label="" />
					<label
						label={keymap.as((k) => `${k}`)}
						halign={Gtk.Align.START}
					/>
				</box>
			</button>
		</box>
	);
}
