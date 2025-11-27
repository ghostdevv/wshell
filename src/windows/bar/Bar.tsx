import { components } from '$lib/extensions/extensions';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { Render } from '$lib/extensions/render';
import { config } from '$lib/config/config';
import app from 'ags/gtk4/app';

async function getComponents(part: 'left' | 'center' | 'right') {
	const promises = config.surfaces.bar[part]?.map(async (id) => {
		const cmp = components.get(id);
		if (!cmp) return null;

		return {
			id: cmp.id,
			type: cmp.type,
			...(await cmp.module()),
		};
	});

	if (!promises) {
		return null;
	}

	// prettier-ignore
	return (await Promise.all(promises))
		.filter((component) => component !== null);
}

const [left, center, right] = await Promise.all([
	getComponents('left'),
	getComponents('center'),
	getComponents('right'),
]);

export default function Bar(props: { monitor: Gdk.Monitor }) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			visible
			name="bar"
			class="bar"
			gdkmonitor={props.monitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box $type="start" halign={Gtk.Align.END} spacing={8}>
					{left?.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>

				<box $type="center" halign={Gtk.Align.END}>
					{center?.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>

				<box $type="end" halign={Gtk.Align.END} spacing={8}>
					{right?.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>
			</centerbox>
		</window>
	) as Astal.Window;
}
