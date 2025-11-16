import { subprocess } from 'ags/process';
import { createExternal } from 'gnim';
import { klona } from 'klona';

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

type WorkspacesMap = Record<string, Workspace[]>;

export const workspacesMap = createExternal<WorkspacesMap>({}, (set) => {
	function handleEvent(msg: string) {
		try {
			const data: Event = JSON.parse(msg);

			if (data.WorkspacesChanged) {
				const newWorkspaces = Object.groupBy(
					data.WorkspacesChanged.workspaces,
					(w) => w.output,
				) as WorkspacesMap;

				for (const workspaces of Object.values(newWorkspaces)) {
					workspaces.sort((a, b) => a.idx - b.idx);
				}

				set(newWorkspaces);
			}

			if (data.WorkspaceActivated) {
				const { id } = data.WorkspaceActivated;

				set((workspacesMap) => {
					for (const workspaces of Object.values(workspacesMap)) {
						const hasChanged = workspaces.some((w) => w.id === id);

						if (hasChanged) {
							for (const workspace of workspaces) {
								if (workspace.id === id) {
									workspace.is_active = true;
								} else {
									workspace.is_active = false;
								}
							}
						}
					}

					return klona(workspacesMap);
				});
			}
		} catch (error) {
			console.error('failed to parse niri event stream message', error);
		}
	}

	const proc = subprocess(
		['niri', 'msg', '--json', 'event-stream'],
		handleEvent,
	);

	return () => {
		proc.kill();
	};
});
