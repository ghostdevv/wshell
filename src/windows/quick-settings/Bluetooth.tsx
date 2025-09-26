import type { RevealerItemState } from '$lib/quick-settings/RevealerItem';
import { createBinding, createState, createComputed } from 'gnim';
import { RevealerItem } from '$lib/quick-settings/RevealerItem';
import { Revealer } from '$lib/quick-settings/Revealer';
import { getIconByPercent } from '$lib/common';
import { notify } from '$lib/notify';
import Bt from 'gi://AstalBluetooth';
import { Gtk } from 'ags/gtk4';
import { For } from 'ags';

function Device(props: { device: Bt.Device }) {
	const alias = createBinding(props.device, 'alias');
	const battery = createBinding(props.device, 'batteryPercentage');
	const connected = createBinding(props.device, 'connected');
	const connecting = createBinding(props.device, 'connecting');

	const showBattery = createComputed((get) => {
		const batteryPercent = get(battery);
		const isConnected = get(connected);

		return isConnected && batteryPercent !== -1;
	});

	const state = createComputed<RevealerItemState>((get) => {
		const isConnected = get(connected);
		const isConnecting = get(connecting);

		return isConnected ? 'on' : isConnecting ? 'busy' : 'off';
	});

	return (
		<RevealerItem
			state={state}
			onClick={() => {
				const isConnecting = connecting.get();
				if (isConnecting) return;

				const isConnected = connected.get();

				if (isConnected) {
					props.device.disconnect_device(async (device) => {
						if (!device?.get_connected()) {
							await notify({
								title: device?.get_alias(),
								message: 'disconnected!',
							});
						}
					});
				} else {
					props.device.connect_device(async (device) => {
						if (!device?.get_connected()) {
							await notify({
								title: device?.get_alias(),
								message: 'failed to connect',
							});
						}
					});
				}
			}}
			label={
				<box hexpand>
					<label label={alias} halign={Gtk.Align.START} hexpand />

					<label
						halign={Gtk.Align.END}
						visible={showBattery}
						label={battery.as((b) => {
							return `${getIconByPercent(b, ['', '', '', '', ''])} ${Math.round(b * 100)}%`;
						})}
					/>
				</box>
			}
		/>
	);
}

export function Bluetooth() {
	const bluetooth = Bt.get_default();

	const bluetoothOn = createBinding(bluetooth, 'is_powered');

	const devices = createBinding(bluetooth, 'devices').as((devices) => {
		return devices.sort((a, b) => {
			// First sort by connection status (connected devices first)
			const connectedDiff = +b.connected - +a.connected;
			if (connectedDiff !== 0) return connectedDiff;

			// If connection status is the same, sort alphabetically by alias
			return a.alias.localeCompare(b.alias);
		});
	});

	const [open, setOpen] = createState(false);

	return (
		<box orientation={Gtk.Orientation.VERTICAL} hexpand>
			<box
				hexpand
				cssClasses={bluetoothOn.as((on) => [
					'button-dropdown',
					on ? 'active' : '',
				])}
			>
				<button
					hexpand
					onClicked={() => {
						bluetooth.toggle();
					}}
				>
					<box spacing={6}>
						<label class="icon" label="" />
						<label label="Bluetooth" halign={Gtk.Align.START} />
					</box>
				</button>

				<button onClicked={() => setOpen(!open.get())}>
					<label
						label=""
						valign={Gtk.Align.CENTER}
						cssClasses={open.as((open) => [
							'chevron',
							open ? 'down' : '',
						])}
					/>
				</button>
			</box>

			<Revealer open={open}>
				<For each={devices}>
					{(device) => <Device device={device} />}
				</For>
			</Revealer>
		</box>
	);
}
