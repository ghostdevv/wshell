import { createPoll } from 'ags/time';
import { exec } from 'ags/process';

const POLL_INTERVAL = 10000;

export function Vitals() {
	const memory = createPoll('...', POLL_INTERVAL, ['free', '--mega']).as(
		(output) => {
			const parts = output
				.split('\n')
				.find((line) => line.trim().startsWith('Mem:'))
				?.trim()
				?.split(/\s+/);

			if (!parts) {
				return { used: null, total: null, percent: null };
			}

			const total = parseInt(parts[1]);
			const used = parseInt(parts[2]);
			const percent = Math.floor((used / total) * 100);
			return { used, total, percent };
		},
	);

	const cpu = createPoll('...', POLL_INTERVAL, ['cat', '/proc/stat']).as(
		(output) => {
			// cpu user nice system idle iowait irq softirq steal guest guest_nice
			const lines = output.split('\n');

			function calculatePercent(values: number[]) {
				const idle = values[3] + values[4]; // idle + iowait
				const total = values.reduce((sum, val) => sum + val, 0);
				const used = total - idle;
				return Math.round((used / total) * 100);
			}

			// Total CPU (first line)
			const totalLine = lines[0];
			if (!totalLine.startsWith('cpu ')) return { total: -1, cores: [] };

			const totalValues = totalLine
				.split(/\s+/)
				.slice(1)
				.map((v) => parseInt(v));
			const total = calculatePercent(totalValues);

			// Individual cores (cpu0, cpu1, cpu2, etc.)
			const cores = [];
			for (let i = 1; i < lines.length; i++) {
				const line = lines[i];
				if (!line.startsWith('cpu')) break;

				const values = line
					.split(/\s+/)
					.slice(1)
					.map((v) => parseInt(v));
				cores.push(calculatePercent(values));
			}

			return { total, cores };
		},
	);

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
