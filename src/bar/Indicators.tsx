import Bluetooth from 'gi://AstalBluetooth';
import Battery from 'gi://AstalBattery';
import Network from 'gi://AstalNetwork';
import { createBinding } from 'gnim';
import Wp from 'gi://AstalWp';

function getIconByPercent(percent: number, icons: string[]): string {
	// Clamp the percentage between 0 and 1
	const clampedPercent = Math.max(0, Math.min(1, percent));

	// Calculate the index (0 to icons.length - 1)
	const index = Math.floor(clampedPercent * icons.length);

	// Handle edge case where percent is exactly 1.0
	const safeIndex = Math.min(index, icons.length - 1);

	return icons[safeIndex];
}

function fmtPercent(percent: number): string {
	return `${Math.floor(percent * 100)}%`;
}

export function Indicators() {
	const battery = createBinding(Battery.get_default(), 'percentage');
	const batteryPercentage = battery.as((percent) => fmtPercent(percent));
	const batteryIcon = battery.as((percent) =>
		getIconByPercent(percent, ['', '', '', '', '']),
	);

	const wp = Wp.get_default();
	const speaker = wp.audio.defaultSpeaker;
	const speakerVolume = createBinding(speaker, 'volume');
	const speakerDescription = createBinding(speaker, 'description');
	const microphone = wp.audio.defaultMicrophone;
	const microphoneVolume = createBinding(microphone, 'volume');
	const microphoneMute = createBinding(microphone, 'mute');
	const microphoneDescription = createBinding(microphone, 'description');

	const bluetooth = Bluetooth.get_default();
	const bluetoothDevices = createBinding(bluetooth, 'devices').as((devices) =>
		devices.filter((d) => d.connected),
	);

	const network = Network.get_default();
	const networkIcon = createBinding(network, 'primary').as((p) =>
		p == Network.Primary.WIFI
			? ''
			: p == Network.Primary.WIRED
				? ''
				: '?',
	);

	return (
		<box class="group" spacing={8}>
			<box spacing={6}>
				<label class="icon" label={networkIcon} />
			</box>

			<box
				spacing={6}
				tooltipMarkup={bluetoothDevices.as((devices) =>
					devices.map((d) => d.name).join('\n'),
				)}
			>
				<label class="icon" label="" />
				<label
					label={bluetoothDevices.as(
						(devices) => `(${devices.length})`,
					)}
					visible={bluetoothDevices.as(
						(devices) => devices.length > 0,
					)}
				/>
			</box>

			<box spacing={6} tooltipMarkup={speakerDescription}>
				<label
					class="icon"
					label={speakerVolume.as((vol) =>
						getIconByPercent(vol, ['', '', '']),
					)}
				/>
				<label label={speakerVolume.as((vol) => fmtPercent(vol))} />
			</box>

			<box spacing={6} tooltipMarkup={microphoneDescription}>
				<label
					class="icon"
					label={microphoneMute.as((mute) => (mute ? '' : ''))}
				/>
				<label
					label={microphoneVolume.as((vol) => fmtPercent(vol))}
					visible={microphoneMute.as((mute) => !mute)}
				/>
			</box>

			<box spacing={6}>
				<label class="icon" label={batteryIcon} />
				<label label={batteryPercentage} />
			</box>
		</box>
	);
}
