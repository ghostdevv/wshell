import { IconSlider } from '../lib/slider/IconSlider';
import { monitorFile } from 'ags/file';
import { exec, execAsync } from 'ags/process';
import { createState } from 'gnim';

function getInfo() {
	const res = exec(['brightnessctl', '--machine-readable', 'info'])
		.trim()
		.split(',');

	const [device, , initial, , max] = res;

	return {
		device,
		max: parseInt(max),
		initial: parseInt(initial),
	};
}

export function Brightness() {
	const { device, max, initial } = getInfo();
	const [brightness, setBrightness] = createState(initial);

	monitorFile(
		`/sys/class/backlight/${device}/brightness`,
		async (file, a) => {
			const current = await execAsync([
				'brightnessctl',
				'--machine-readable',
				'get',
			]);

			const newBrightness = parseInt(current.trim());

			if (brightness.get() !== newBrightness) {
				setBrightness(newBrightness);
			}
		},
	);

	function onChangeValue(value: number) {
		execAsync(['brightnessctl', 'set', `${value}`]);
	}

	return (
		<box>
			<IconSlider
				icon=""
				onChangeValue={onChangeValue}
				value={brightness}
				step={Math.round(max / 100)}
				max={max}
				min={0}
			/>
		</box>
	);
}
