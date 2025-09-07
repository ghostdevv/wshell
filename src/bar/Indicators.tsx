import { fmtPercent, getIconByPercent } from '../common';
import { createBinding, createComputed } from 'gnim';
import Bluetooth from 'gi://AstalBluetooth';
import Battery from 'gi://AstalBattery';
import Network from 'gi://AstalNetwork';
import Wp from 'gi://AstalWp';

export function Indicators() {
	const battery = Battery.get_default();
	const batteryCharge = createBinding(Battery.get_default(), 'percentage');
	const batteryPercentage = batteryCharge.as((percent) =>
		fmtPercent(percent),
	);
	const batteryCharging = createBinding(battery, 'charging');
	const batteryIcon = createComputed((get) =>
		get(batteryCharging)
			? ''
			: getIconByPercent(get(batteryCharge), ['', '', '', '', '']),
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
