import { createComputed, type Accessor } from 'gnim';
import { workspacesMap } from '$lib/workspaces';
import { exec } from 'ags/process';
import { For } from 'ags';

export function Workspaces(props: { output: Accessor<string | null> }) {
	const workspaces = createComputed((get) => {
		const workspacesMapValue = get(workspacesMap);
		const output = get(props.output);
		return output ? (workspacesMapValue[output] ?? []) : [];
	});

	return (
		<box
			class="group"
			spacing={8}
			visible={workspaces.as((w) => w.length > 0)}
		>
			<For each={workspaces}>
				{(workspace) => (
					<button
						cssClasses={['icon', workspace.is_active ? 'fas' : '']}
						onClicked={() => {
							if (!workspace.is_active) {
								try {
									exec([
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
}
