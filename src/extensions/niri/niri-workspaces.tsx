import { createBarExtension } from '$lib/extensions/bar';
import { createComputed, createBinding } from 'gnim';
import { workspacesMap } from './workspaces';
import { execAsync } from 'ags/process';
import { For } from 'ags';

export const niriWorkspaces = createBarExtension({
	id: 'niri-workspaces',
	align: 'left',
	render({ monitor }) {
		const connector = createBinding(monitor, 'connector');

		const workspaces = createComputed((get) => {
			const workspacesMapValue = get(workspacesMap);
			const c = get(connector) as string | null;
			return c ? (workspacesMapValue[c] ?? []) : [];
		});

		return (
			<box
				class="group"
				spacing={4}
				visible={workspaces.as((w) => w.length > 0)}
			>
				<For each={workspaces}>
					{(workspace) => (
						<button
							cssClasses={[
								'icon',
								workspace.is_active ? 'fas' : '',
							]}
							onClicked={async () => {
								if (!workspace.is_active) {
									try {
										await execAsync([
											'niri',
											'msg',
											'action',
											'focus-workspace',
											// note that this uses index not id
											`${workspace.idx}`,
										]);
									} catch (error) {
										console.error(
											'failed to focus workspace',
											error,
										);
									}
								}
							}}
						>
							<label label="" />
						</button>
					)}
				</For>
			</box>
		);
	},
});
