import { createPoll } from 'ags/time';

const POLL_INTERVAL = 5000;

export const memory = createPoll('?%', POLL_INTERVAL, ['free', '--mega']).as(
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

export const cpu = createPoll('?%', POLL_INTERVAL, [
	'mpstat',
	'-P',
	'ALL',
	'3',
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
