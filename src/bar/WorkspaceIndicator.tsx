import { subprocess, exec } from 'ags/process';
import { For, createState } from 'ags';
import { onCleanup } from 'gnim';

interface Workspace {
	id: number;
	idx: number;
	name?: string;
	output: string;
	is_urgent: boolean;
	is_active: boolean;
	is_focused: boolean;
	active_window_id?: number;
}

interface WorkspacesChangedEvent {
	workspaces: Workspace[];
}

interface WorkspaceActivatedEvent {
	id: number;
	focused: boolean;
}

interface Event {
	WorkspacesChanged?: WorkspacesChangedEvent;
	WorkspaceActivated?: WorkspaceActivatedEvent;
}

export function WorkspaceIndicator(props: { monitor: string }) {
	const [workspaces, setWorkspaces] = createState<Workspace[]>([]);

	function handleEvent(msg: string) {
		try {
			const data: Event = JSON.parse(msg);

			if (data.WorkspacesChanged) {
				const newWorkspaces = data.WorkspacesChanged.workspaces
					.filter((w) => w.output === props.monitor)
					.sort((a, b) => a.idx - b.idx);

				setWorkspaces(newWorkspaces);
			}

			if (data.WorkspaceActivated) {
				const { id } = data.WorkspaceActivated;

				if (!workspaces.get().some((w) => w.id === id)) {
					// this checks whether the event is related to a
					// workspace that we care about, i.e. the ones
					// on our output.
					return;
				}

				const patchedWorkspaces = workspaces
					.get()
					.map((w) => ({ ...w, is_active: w.id === id }))
					.sort((a, b) => a.idx - b.idx);

				setWorkspaces(patchedWorkspaces);
			}
		} catch (error) {
			console.error('failed to parse niri event stream message', error);
		}
	}

	const proc = subprocess(
		['niri', 'msg', '--json', 'event-stream'],
		handleEvent,
	);

	onCleanup(() => {
		proc.kill();
	});

	return (
		<box class="group" spacing={8}>
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
