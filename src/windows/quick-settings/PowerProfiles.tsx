import { RevealerItem } from '$lib/quick-settings/RevealerItem';
import AstalPowerProfiles from 'gi://AstalPowerProfiles';
import { Revealer } from '$lib/quick-settings/Revealer';
import { createBinding, createState } from 'gnim';
import type { Accessor } from 'gnim';
import { Gtk } from 'ags/gtk4';

const PROFILES = ['power-saver', 'balanced', 'performance'] as const;
type Profile = (typeof PROFILES)[number];

function getProfileHeader(profile: Profile) {
	switch (profile) {
		case 'performance':
			return { label: 'Performance', icon: '' };

		case 'balanced':
			return { label: 'Balanced', icon: '' };

		case 'power-saver':
			return { label: 'Power Saver', icon: '' };
	}
}

export function PowerProfiles() {
	const powerProfiles = AstalPowerProfiles.get_default();

	const activeProfile = createBinding(
		powerProfiles,
		'activeProfile',
	) as Accessor<Profile>;

	const header = activeProfile.as((profile) => getProfileHeader(profile));

	let lastProfileIsh: Omit<Profile, 'balanced'> = 'performance';
	function setProfile(profile: Profile) {
		if (profile !== 'balanced') {
			lastProfileIsh = profile;
		}

		powerProfiles.set_active_profile(profile);
	}

	const [open, setOpen] = createState(false);

	return (
		<box orientation={Gtk.Orientation.VERTICAL} hexpand>
			<box
				hexpand
				cssClasses={activeProfile.as((profile) => [
					'button-dropdown',
					profile !== 'balanced' ? 'active' : '',
				])}
			>
				<button
					hexpand
					onClicked={() => {
						setProfile(
							activeProfile.get() === 'balanced'
								? (lastProfileIsh as Profile)
								: 'balanced',
						);
					}}
				>
					<box spacing={6}>
						<label
							label={header.as((header) => header.icon)}
							class="icon"
						/>
						<label
							label={header.as((header) => header.label)}
							halign={Gtk.Align.START}
						/>
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
				{PROFILES.map((profile) => {
					const header = getProfileHeader(profile);

					return (
						<RevealerItem
							state={activeProfile.as((activeProfile) =>
								activeProfile === profile ? 'on' : 'off',
							)}
							onClick={() => {
								setProfile(profile);
							}}
							label={
								<box spacing={6}>
									<label label={header.icon} class="icon" />
									<label
										label={header.label}
										halign={Gtk.Align.START}
									/>
								</box>
							}
						/>
					);
				})}
			</Revealer>
		</box>
	);
}
