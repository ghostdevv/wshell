import type { BarRender } from '$lib/extensions/bar';
import { execAsync } from 'ags/process';
import { cpu, memory } from './state';

export const render: BarRender = () => {
	return (
		<button
			class="group"
			onClicked={async () => {
				try {
					await execAsync([
						'gtk-launch',
						'io.missioncenter.MissionCenter',
					]);
				} catch (error) {
					console.error('Failed to launch Mission Center:', error);
				}
			}}
		>
			<box spacing={8}>
				<box
					spacing={6}
					tooltipMarkup={cpu.as((cpu) =>
						cpu.cores.map((p, i) => `Core ${i}\t ${p}%`).join('\n'),
					)}
				>
					<label class="icon" label="" />
					<label
						class="value"
						label={cpu.as((cpu) => `${cpu.total ?? '?'}%`)}
					/>
				</box>

				<box
					spacing={6}
					tooltipMarkup={memory.as(
						(mem) => `${mem.used} / ${mem.total} MB`,
					)}
				>
					<label class="icon" label="" />
					<label
						class="value"
						label={memory.as((mem) => `${mem.percent ?? '?'}%`)}
					/>
				</box>
			</box>
		</button>
	);
};
