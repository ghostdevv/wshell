import { createPoll } from 'ags/time';
import { exec } from 'ags/process';

const POLL_INTERVAL = 5000;

export function Vitals() {
	const memory = createPoll('?%', POLL_INTERVAL, ['free', '--mega']).as(
		(output) => {
			const parts = output
				.split('\n')
				.find((line) => line.trim().startsWith('Mem:'))
				?.trim()
				?.split(/\s+/);

			if (!parts) {
				return { used: null, total: null, percent: null };
			}

			const total = Number.parseInt(parts[1], 10);
			const used = Number.parseInt(parts[2], 10);
			const percent = Math.floor((used / total) * 100);
			return { used, total, percent };
		},
	);

	const cpu = createPoll('?%', POLL_INTERVAL, [
		'mpstat',
		'-P',
		'ALL',
		'1',
		'1',
	]).as((output) => {
		const lines = output.trim().split('\n');

		let total = -1;
		const cores: number[] = [];

		for (const line of lines) {
			// Skip header lines, average lines, and empty lines
			if (
				line.includes('CPU') ||
				line.includes('Average:') ||
				line.trim() === ''
			)
				continue;

			const values = line.trim().split(/\s+/);
			if (values.length < 12) continue;

			const cpu = values[1]; // CPU column (all, 0, 1, 2, etc.)
			// Calculate active CPU usage excluding iowait
			// %usr + %nice + %sys + %irq + %soft + %steal + %guest + %gnice
			const usr = Number.parseFloat(values[2]);
			const nice = Number.parseFloat(values[3]);
			const sys = Number.parseFloat(values[4]);
			const irq = Number.parseFloat(values[6]);
			const soft = Number.parseFloat(values[7]);
			const steal = Number.parseFloat(values[8]);
			const guest = Number.parseFloat(values[9]);
			const gnice = Number.parseFloat(values[10]);
			const usage = Math.round(
				usr + nice + sys + irq + soft + steal + guest + gnice,
			);

			if (cpu === 'all') {
				total = usage;
			} else if (!Number.isNaN(Number.parseInt(cpu, 10))) {
				cores.push(usage);
			}
		}

		return { total, cores };
	});

	return (
		<button
			class="group"
			onClicked={() => {
				try {
					exec(['gtk-launch', 'io.missioncenter.MissionCenter']);
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
						label={cpu.as((cpu) => `${cpu.total}%`)}
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
						label={memory.as((mem) => `${mem.percent}%`)}
					/>
				</box>
			</box>
		</button>
	);
}
