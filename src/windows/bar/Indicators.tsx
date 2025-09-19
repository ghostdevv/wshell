import { handleDropdownWindow } from '../../lib/dropdown/utils';
import { fmtPercent, getIconByPercent } from '../../common';
import QuickSettings from '../quick-settings/QuickSettings';
import { createBinding, createComputed } from 'gnim';
import Bluetooth from 'gi://AstalBluetooth';
import Network from 'gi://AstalNetwork';
import { execAsync } from 'ags/process';
import Battery from 'gi://AstalBattery';
import type { Gdk } from 'ags/gtk4';
import Wp from 'gi://AstalWp';

async function notify(message: string, type?: 'low' | 'normal' | 'critical') {
	await execAsync(['notify-send', type ? `--urgency=${type}` : '', message]);
}

async function checkBatteryPercent(percent: number) {
	switch (percent) {
		case 0.1:
			await notify('Battery is low', 'normal');
			break;

		case 0.05:
			await notify('Battery is critically low', 'critical');
			break;

		case 0.01:
			await notify('Battery is critically critically low', 'critical');
			break;
	}
}

export function Indicators(props: { monitor: Gdk.Monitor }) {
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

	checkBatteryPercent(batteryCharge.get());
	batteryCharge.subscribe(() => checkBatteryPercent(batteryCharge.get()));

	const wp = Wp.get_default();
	const speaker = wp.audio.defaultSpeaker;
	const speakerVolume = createBinding(speaker, 'volume');
	const speakerDescription = createBinding(speaker, 'description');
	const microphone = wp.audio.defaultMicrophone;
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

	const quickSettingsWindow = handleDropdownWindow(
		QuickSettings({ monitor: props.monitor }),
	);

	return (
		<button onClicked={() => quickSettingsWindow.toggle()}>
			<box spacing={8}>
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
				</box>

				<box spacing={6} tooltipMarkup={microphoneDescription}>
					<label
						class="icon"
						label={microphoneMute.as((mute) => (mute ? '' : ''))}
					/>
				</box>

				<box spacing={6}>
					<label class="icon" label={batteryIcon} />
					<label label={batteryPercentage} />
				</box>
			</box>
		</button>
	);
}
