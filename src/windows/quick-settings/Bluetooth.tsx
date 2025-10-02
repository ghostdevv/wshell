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
	const trusted = createBinding(props.device, 'trusted');

	const showBattery = createComputed((get) => {
		const batteryPercent = get(battery);
		const isConnected = get(connected);

		return isConnected && batteryPercent !== -1;
	});

	const state = createComputed<RevealerItemState>((get) => {
		const isConnected = get(connected);
		const isConnecting = get(connecting);
		const isTrusted = get(trusted);

		return isConnected
			? 'on'
			: isConnecting
				? 'busy'
				: !isTrusted
					? 'new'
					: 'off';
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
						props.device.set_trusted(true);

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

			// If connection status is the same, sort by paired status (paired devices next)
			const pairedDiff = +b.paired - +a.paired;
			if (pairedDiff !== 0) return pairedDiff;

			// If both connection and paired status are the same, sort alphabetically by alias
			return a.alias.localeCompare(b.alias);
		});
	});

	const [open, setOpen] = createState(false);

	const scanning = createBinding(bluetooth.adapter, 'discovering');

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
				<box orientation={Gtk.Orientation.VERTICAL}>
					<For each={devices}>
						{(device) => <Device device={device} />}
					</For>
				</box>

				<Gtk.Separator css="margin: 4px 0px;" />

				<button
					onClicked={() => {
						if (scanning.get()) {
							bluetooth.adapter.stop_discovery();
						} else {
							bluetooth.adapter.start_discovery();
						}
					}}
				>
					<label
						label={scanning.as((scanning) =>
							scanning ? 'Scanning...' : 'Scan',
						)}
						css="font-size: 12px;"
						halign={Gtk.Align.START}
					/>
				</button>
			</Revealer>
		</box>
	);
}
