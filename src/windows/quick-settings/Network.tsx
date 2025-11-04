import { createBinding, createState, createComputed } from 'gnim';
import { Revealer } from '$lib/quick-settings/Revealer';
import { type Accessor, For, With } from 'ags';
import AstalNetwork from 'gi://AstalNetwork';
import { execAsync } from 'ags/process';
import { notify } from '$lib/notify';
import { Gtk } from 'ags/gtk4';
import {
	type RevealerItemState,
	RevealerItem,
} from '$lib/quick-settings/RevealerItem';

const network = AstalNetwork.get_default();

const [knownBssids, setKnownBssids] = createState(new Set<string>());

function refreshKnownBssids() {
	const bssids = new Set<string>();
	try {
		const client = network.get_client();
		const connections = client.get_connections();

		for (const connection of connections) {
			if (connection.get_connection_type() === '802-11-wireless') {
				const wifiSettings = connection.get_setting_wireless();
				if (wifiSettings) {
					const seenBssidsCount = wifiSettings.get_num_seen_bssids();
					for (let i = 0; i < seenBssidsCount; i++) {
						const seenBssid = wifiSettings.get_seen_bssid(i);
						if (seenBssid) {
							bssids.add(seenBssid);
						}
					}
				}
			}
		}
	} catch (error) {
		console.error('Error loading connection history:', error);
	}

	setKnownBssids(bssids);
}

interface APProps {
	ap: AstalNetwork.AccessPoint;
	activeAp: Accessor<AstalNetwork.AccessPoint | null>;
}

function AP({ ap, activeAp }: APProps) {
	const strength = createBinding(ap, 'strength');
	const rate = createBinding(ap, 'maxBitrate');
	const infoStr = createComputed(
		(get) => `${Math.round(get(rate) / 1000)} Mbit/s\t${get(strength)}%`,
	);

	const [connecting, setConnecting] = createState(false);

	const state = createComputed<RevealerItemState>((get) => {
		const hasConnectedBefore = get(knownBssids).has(ap.bssid);
		const activeApValue = get(activeAp);
		const isConnecting = get(connecting);

		if (isConnecting) {
			return 'busy';
		}

		if (ap.bssid === activeApValue?.bssid) {
			return 'on';
		}

		if (!hasConnectedBefore) {
			return 'new';
		}

		return 'off';
	});

	return (
		<RevealerItem
			state={state}
			onClick={async () => {
				try {
					setConnecting(true);
					try {
						await execAsync([
							'nmcli',
							'device',
							'wifi',
							'connect',
							ap.bssid,
						]);

						// Refresh known BSSIDs after successful connection
						// Wait a moment for NetworkManager to update the connection
						setTimeout(refreshKnownBssids, 2000);
					} catch (error) {
						const title = `Failed to connect to ${ap.ssid} (${ap.bssid})`;
						console.error(title, error);
						notify({
							type: 'error',
							title,
							message:
								error instanceof Error
									? error.message
									: `${error}`,
						});
					} finally {
						setConnecting(false);
					}
				} catch (e) {
					const title = `Failed to connect to ${ap.ssid} (${ap.bssid})`;
					console.error(title, e);
					notify({
						title,
						message: e instanceof Error ? e.message : `${e}`,
					});
				}
			}}
			label={
				<box hexpand>
					<label
						label={ap.ssid}
						halign={Gtk.Align.START}
						hexpand
						tooltipMarkup={infoStr}
					/>
				</box>
			}
		/>
	);
}

function WiFi() {
	const activeAp = createBinding(network.wifi, 'activeAccessPoint');

	const aps = createBinding(network.wifi, 'accessPoints').as((aps) => {
		// const seenSSIDs = new Set<string>();

		return aps
			.filter((ap) => typeof ap.get_ssid() === 'string' && ap.ssid.length)
			.sort((a, b) => {
				const aKnown = knownBssids.get().has(a.bssid);
				const bKnown = knownBssids.get().has(b.bssid);

				// Previously connected networks first
				if (aKnown && !bKnown) return -1;
				if (!aKnown && bKnown) return 1;

				// Within each group, sort by signal strength
				return b.strength - a.strength;
			});
		// .filter((ap) => {
		// 	if (seenSSIDs.has(ap.ssid)) {
		// 		return false;
		// 	}

		// 	seenSSIDs.add(ap.ssid);
		// 	return true;
		// });
	});

	const scanning = createBinding(network.wifi, 'scanning');
	const enabled = createBinding(network.wifi, 'enabled');

	const [open, setOpen] = createState(false);

	return (
		<box orientation={Gtk.Orientation.VERTICAL} hexpand>
			<box
				hexpand
				cssClasses={enabled.as((enabled) => [
					'button-dropdown',
					enabled ? 'active' : '',
				])}
			>
				<button
					hexpand
					onClicked={() => {
						network.wifi.set_enabled(!network.wifi.get_enabled());
					}}
				>
					<box spacing={6}>
						<label class="icon" label="" />
						<label label="WiFi" halign={Gtk.Align.START} />
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
				<scrolledwindow
					propagateNaturalHeight
					maxContentHeight={200}
					hscrollbarPolicy={Gtk.PolicyType.NEVER}
				>
					<box orientation={Gtk.Orientation.VERTICAL}>
						<For each={aps}>
							{(ap) => <AP ap={ap} activeAp={activeAp} />}
						</For>
					</box>
				</scrolledwindow>

				<Gtk.Separator css="margin: 4px 0px;" />

				<button
					onClicked={() => {
						if (!scanning.get()) {
							network.wifi.scan();
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

function Wired() {
	return (
		<button hexpand onClicked={() => {}}>
			<box spacing={6}>
				<label class="icon" label="" />
				<label label="Wired" halign={Gtk.Align.START} />
			</box>
		</button>
	);
}

export function Network() {
	const primary = createBinding(network, 'primary').as((primary) => {
		if (primary === AstalNetwork.Primary.WIRED) {
			return 'wired';
		}

		if (primary === AstalNetwork.Primary.WIFI || network.wifi) {
			return 'wifi';
		}

		return null;
	});

	return (
		<box hexpand>
			<With value={primary}>
				{(primary) => {
					switch (primary) {
						case 'wifi':
							return <WiFi />;

						case 'wired':
							return <Wired />;
					}
				}}
			</With>
		</box>
	);
}
